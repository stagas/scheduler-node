import { SchedulerEventGroupNode, SchedulerNode } from '..'
import { IncNode } from './fixture/inc-node'

describe('SchedulerNode', () => {
  it('can send single note', async () => {
    const ctx = new OfflineAudioContext({ length: 128 * 2, numberOfChannels: 1, sampleRate: 44100 })
    const schedulerNode = await SchedulerNode.create(ctx)
    expect(schedulerNode).toBeInstanceOf(SchedulerNode)
    expect(await schedulerNode.start()).toBe(0)

    const scheduler = new SchedulerEventGroupNode(schedulerNode)

    await IncNode.register(ctx)
    const incNode = new IncNode(ctx)
    await incNode.init()

    scheduler.connect(incNode)

    // [time, note, velocity, length]
    const events = scheduler.eventGroup.replaceAllWithNotes([[0, 5, 127, 0]])
    expect(events.length).toBe(2)

    incNode.connect(ctx.destination)

    // events get sent at the microtask queue
    await Promise.resolve()

    const result = await ctx.startRendering()
    const data = result.getChannelData(0)
    expect(data[128 * 0]).toEqual(6)
    expect(data[128 * 1]).toEqual(8)
  })

  it('can schedule note', async () => {
    const ctx = new OfflineAudioContext({ length: 128 * 3, numberOfChannels: 1, sampleRate: 44100 })
    const schedulerNode = await SchedulerNode.create(ctx)
    expect(schedulerNode).toBeInstanceOf(SchedulerNode)
    expect(await schedulerNode.start()).toBe(0)

    const scheduler = new SchedulerEventGroupNode(schedulerNode)

    await IncNode.register(ctx)
    const incNode = new IncNode(ctx)
    await incNode.init()

    scheduler.connect(incNode)

    // [time, note, velocity, length]
    const events = scheduler.eventGroup.replaceAllWithNotes([[128 / 44100, 5, 127, 0]])
    expect(events.length).toBe(2)
    incNode.connect(ctx.destination)

    // events get sent at the microtask queue
    await Promise.resolve()

    const result = await ctx.startRendering()
    const data = result.getChannelData(0)
    expect(data[128 * 0]).toEqual(1)
    expect(data[128 * 1]).toEqual(6)
    expect(data[128 * 2]).toEqual(8)
  })

  it('can loop', async () => {
    const ctx = new OfflineAudioContext({ length: 128 * 3, numberOfChannels: 1, sampleRate: 44100 })
    const schedulerNode = await SchedulerNode.create(ctx)
    expect(schedulerNode).toBeInstanceOf(SchedulerNode)
    expect(await schedulerNode.start()).toBe(0)

    const scheduler = new SchedulerEventGroupNode(schedulerNode)

    await IncNode.register(ctx)
    const incNode = new IncNode(ctx)
    await incNode.init()

    scheduler.connect(incNode)

    // [time, note, velocity, length]
    const events = scheduler.eventGroup.replaceAllWithNotes([[0, 5, 127, 0]])
    expect(events.length).toBe(2)
    incNode.connect(ctx.destination)

    scheduler.eventGroup.loopEnd = 128 / 44100
    scheduler.eventGroup.loop = true

    // events get sent at the microtask queue
    await Promise.resolve()

    const result = await ctx.startRendering()
    const data = result.getChannelData(0)
    expect(data[128 * 0]).toEqual(6)
    expect(data[128 * 0 + 1]).toEqual(7)
    expect(data[128 * 1]).toEqual(6)
    expect(data[128 * 1 + 1]).toEqual(7)
    expect(data[128 * 2]).toEqual(6)
    expect(data[128 * 2 + 1]).toEqual(7)
  })
})
