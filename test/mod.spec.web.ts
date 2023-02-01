// @env browser

import { LoopKind, NoteEvent, SchedulerEventGroupNode, SchedulerNode } from '..'
import { IncNode } from './fixture/inc-node'
import { ConstNode } from './fixture/const-node'
import { PipeNode } from 'webaudio-tools'
import { wait } from 'everyday-utils'

describe('SchedulerNode', () => {
  xit('can send single note', async () => {
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
    const events = scheduler.eventGroup.setNotes([[0, 5, 127, 0]])
    expect(events.length).toBe(2)

    incNode.connect(ctx.destination)

    // events get sent at the microtask queue
    await Promise.resolve()

    const result = await ctx.startRendering()
    const data = result.getChannelData(0)
    expect(data[128 * 0]).toEqual(6)
    expect(data[128 * 1]).toEqual(8)
  })

  xit('can schedule note', async () => {
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
    const events = scheduler.eventGroup.setNotes([[128 / 44100, 5, 127, 0]])
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

  xit('can loop', async () => {
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
    const events = scheduler.eventGroup.setNotes([[0, 5, 127, 0]])
    expect(events.length).toBe(2)
    incNode.connect(ctx.destination)

    scheduler.eventGroup.loopEnd = 128 / 44100
    scheduler.eventGroup.loop = LoopKind.Loop

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

  xit('can live loop', async () => {
    const ctx = new AudioContext({ sampleRate: 44100 })

    const schedulerNode = await SchedulerNode.create(ctx)
    expect(schedulerNode).toBeInstanceOf(SchedulerNode)
    await schedulerNode.start(ctx.currentTime + 0.05)

    const scheduler = new SchedulerEventGroupNode(schedulerNode)
    const getNextNotes = (turn: number): NoteEvent[] => {
      return ([
        [0, 15 + 10 * turn, 127, 0.1]
      ])
    }

    await Promise.resolve()

    scheduler.eventGroup.onRequestNotes = (turn) => {
      setTimeout(() => {
        scheduler.eventGroup.setNotes(
          [getNextNotes(turn), getNextNotes(turn + 1)],
          turn
        )
      }, 1)
    }

    await ConstNode.register(ctx)
    const constNode = new ConstNode(ctx)
    await constNode.init()

    scheduler.connect(constNode)

    const channel = new MessageChannel()
    let results: any[] = []
    channel.port1.onmessage = (ev) => {
      results.push(ev)
    }
    const pipeNode = await PipeNode.create(ctx, { port: channel.port2 })

    constNode.connect(pipeNode)
    pipeNode.connect(ctx.destination)

    const mul = 15
    scheduler.eventGroup.loopEnd = (1280 * mul) / 44100
    scheduler.eventGroup.loop = LoopKind.Live

    await wait(2000)

    pipeNode.disconnect()
    constNode.disconnect()
    scheduler.disconnect(constNode)
    ctx.close()

    while (results.length && results[0].data.inputs[0][0][0] < 15) {
      results.shift()
    }

    {
      const data = results[0].data.inputs[0][0]
      expect(data[0]).toEqual(15)
    }

    results = results.slice(10 * mul)
    {
      const data = results[0].data.inputs[0][0]
      expect(data[0]).toEqual(25)
    }

    results = results.slice(10 * mul)
    {
      const data = results[0].data.inputs[0][0]
      expect(data[0]).toEqual(35)
    }

    results = results.slice(10 * mul)
    {
      const data = results[0].data.inputs[0][0]
      expect(data[0]).toEqual(45)
    }

  })
})
