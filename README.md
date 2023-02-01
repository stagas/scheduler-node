

<h1>
scheduler-node <a href="https://npmjs.org/package/scheduler-node"><img src="https://img.shields.io/badge/npm-v2.0.2-F00.svg?colorA=000"/></a> <a href="src"><img src="https://img.shields.io/badge/loc-652-FFF.svg?colorA=000"/></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-F0B.svg?colorA=000"/></a>
</h1>

<p></p>

Sample perfect Audioworklet MIDI Scheduler Node

<h4>
<table><tr><td title="Triple click to select and copy paste">
<code>npm i scheduler-node </code>
</td><td title="Triple click to select and copy paste">
<code>pnpm add scheduler-node </code>
</td><td title="Triple click to select and copy paste">
<code>yarn add scheduler-node</code>
</td></tr></table>
</h4>


## API

<p>  <details id="SchedulerEvent$13" title="Class" ><summary><span><a href="#SchedulerEvent$13">#</a></span>  <code><strong>SchedulerEvent</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="constructor$14" title="Constructor" ><summary><span><a href="#constructor$14">#</a></span>  <code><strong>constructor</strong></code><em>(data)</em>    </summary>  <a href=""></a>  <ul>    <p>  <details id="new SchedulerEvent$15" title="ConstructorSignature" ><summary><span><a href="#new SchedulerEvent$15">#</a></span>  <code><strong>new SchedulerEvent</strong></code><em>()</em>    </summary>    <ul><p><a href="#SchedulerEvent$13">SchedulerEvent</a></p>      <p>  <details id="data$16" title="Parameter" ><summary><span><a href="#data$16">#</a></span>  <code><strong>data</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>{}</code></span>  </summary>    <ul><p><span>Partial</span>&lt;<a href="#SchedulerEvent$13">SchedulerEvent</a>&gt;</p>        </ul></details></p>  </ul></details></p>    </ul></details><details id="id$17" title="Property" ><summary><span><a href="#id$17">#</a></span>  <code><strong>id</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>string</p>        </ul></details><details id="midiEvent$18" title="Property" ><summary><span><a href="#midiEvent$18">#</a></span>  <code><strong>midiEvent</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>{<p>  <details id="data$20" title="Property" ><summary><span><a href="#data$20">#</a></span>  <code><strong>data</strong></code>    </summary>  <a href=""></a>  <ul><p><span>Uint8Array</span></p>        </ul></details><details id="receivedTime$21" title="Property" ><summary><span><a href="#receivedTime$21">#</a></span>  <code><strong>receivedTime</strong></code>    </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details></p>}</p>        </ul></details><details id="toJSON$22" title="Method" ><summary><span><a href="#toJSON$22">#</a></span>  <code><strong>toJSON</strong></code><em>()</em>    </summary>  <a href=""></a>  <ul>    <p>      <p><strong>toJSON</strong><em>()</em>  &nbsp;=&gt;  <ul>{<p>  <details id="id$25" title="Property" ><summary><span><a href="#id$25">#</a></span>  <code><strong>id</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>string</p>        </ul></details><details id="midiEvent$26" title="Property" ><summary><span><a href="#midiEvent$26">#</a></span>  <code><strong>midiEvent</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>{<p>  <details id="data$29" title="Property" ><summary><span><a href="#data$29">#</a></span>  <code><strong>data</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><span>Uint8Array</span></p>        </ul></details><details id="receivedTime$28" title="Property" ><summary><span><a href="#receivedTime$28">#</a></span>  <code><strong>receivedTime</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>number</p>        </ul></details></p>}</p>        </ul></details></p>}</ul></p></p>    </ul></details></p></ul></details><details id="SchedulerEventGroup$36" title="Class" ><summary><span><a href="#SchedulerEventGroup$36">#</a></span>  <code><strong>SchedulerEventGroup</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="constructor$37" title="Constructor" ><summary><span><a href="#constructor$37">#</a></span>  <code><strong>constructor</strong></code><em>(eventGroup)</em>    </summary>  <a href=""></a>  <ul>    <p>  <details id="new SchedulerEventGroup$38" title="ConstructorSignature" ><summary><span><a href="#new SchedulerEventGroup$38">#</a></span>  <code><strong>new SchedulerEventGroup</strong></code><em>()</em>    </summary>    <ul><p><a href="#SchedulerEventGroup$36">SchedulerEventGroup</a></p>      <p>  <details id="eventGroup$39" title="Parameter" ><summary><span><a href="#eventGroup$39">#</a></span>  <code><strong>eventGroup</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>{}</code></span>  </summary>    <ul><p><span>Partial</span>&lt;<a href="#SchedulerEventGroup$36">SchedulerEventGroup</a>&gt;</p>        </ul></details></p>  </ul></details></p>    </ul></details><details id="id$40" title="Property" ><summary><span><a href="#id$40">#</a></span>  <code><strong>id</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>string</p>        </ul></details><details id="loopPoints$43" title="Property" ><summary><span><a href="#loopPoints$43">#</a></span>  <code><strong>loopPoints</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><span>Float64Array</span></p>        </ul></details><details id="onRequestNotes$62" title="Property" ><summary><span><a href="#onRequestNotes$62">#</a></span>  <code><strong>onRequestNotes</strong></code>    </summary>  <a href=""></a>  <ul><p><details id="__type$63" title="Function" ><summary><span><a href="#__type$63">#</a></span>  <em>(turn, total)</em>    </summary>    <ul>    <p>    <details id="turn$65" title="Parameter" ><summary><span><a href="#turn$65">#</a></span>  <code><strong>turn</strong></code>    </summary>    <ul><p>number</p>        </ul></details><details id="total$66" title="Parameter" ><summary><span><a href="#total$66">#</a></span>  <code><strong>total</strong></code>    </summary>    <ul><p>number</p>        </ul></details>  <p><strong></strong><em>(turn, total)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details></p>        </ul></details><details id="scheduler$42" title="Property" ><summary><span><a href="#scheduler$42">#</a></span>  <code><strong>scheduler</strong></code>    </summary>  <a href=""></a>  <ul><p><a href="#SchedulerNode$106">SchedulerNode</a></p>        </ul></details><details id="targets$41" title="Property" ><summary><span><a href="#targets$41">#</a></span>  <code><strong>targets</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><span>ImmSet</span>&lt;<a href="#SchedulerTarget$30">SchedulerTarget</a>&gt;</p>        </ul></details><details id="loop$50" title="Accessor" ><summary><span><a href="#loop$50">#</a></span>  <code><strong>loop</strong></code>    </summary>  <a href=""></a>  <ul>        </ul></details><details id="loopEnd$58" title="Accessor" ><summary><span><a href="#loopEnd$58">#</a></span>  <code><strong>loopEnd</strong></code>    </summary>  <a href=""></a>  <ul>        </ul></details><details id="loopStart$54" title="Accessor" ><summary><span><a href="#loopStart$54">#</a></span>  <code><strong>loopStart</strong></code>    </summary>  <a href=""></a>  <ul>        </ul></details><details id="setMidiEvents$67" title="Method" ><summary><span><a href="#setMidiEvents$67">#</a></span>  <code><strong>setMidiEvents</strong></code><em>(turnEvents, turn, clear)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="turnEvents$69" title="Parameter" ><summary><span><a href="#turnEvents$69">#</a></span>  <code><strong>turnEvents</strong></code>    </summary>    <ul><p><span>MIDIMessageEvent</span>  []  []</p>        </ul></details><details id="turn$70" title="Parameter" ><summary><span><a href="#turn$70">#</a></span>  <code><strong>turn</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>0</code></span>  </summary>    <ul><p>number</p>        </ul></details><details id="clear$71" title="Parameter" ><summary><span><a href="#clear$71">#</a></span>  <code><strong>clear</strong></code>    </summary>    <ul><p>boolean</p>        </ul></details>  <p><strong>setMidiEvents</strong><em>(turnEvents, turn, clear)</em>  &nbsp;=&gt;  <ul><span>MIDIMessageEvent</span>  []  []</ul></p></p>    </ul></details><details id="setNotes$72" title="Method" ><summary><span><a href="#setNotes$72">#</a></span>  <code><strong>setNotes</strong></code><em>(turnNotes, turn, clear)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="turnNotes$74" title="Parameter" ><summary><span><a href="#turnNotes$74">#</a></span>  <code><strong>turnNotes</strong></code>    </summary>    <ul><p><a href="#NoteEvent$6">NoteEvent</a>  []  []</p>        </ul></details><details id="turn$75" title="Parameter" ><summary><span><a href="#turn$75">#</a></span>  <code><strong>turn</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>0</code></span>  </summary>    <ul><p>number</p>        </ul></details><details id="clear$76" title="Parameter" ><summary><span><a href="#clear$76">#</a></span>  <code><strong>clear</strong></code>    </summary>    <ul><p>boolean</p>        </ul></details>  <p><strong>setNotes</strong><em>(turnNotes, turn, clear)</em>  &nbsp;=&gt;  <ul><span>MIDIMessageEvent</span>  []  []</ul></p></p>    </ul></details><details id="toJSON$44" title="Method" ><summary><span><a href="#toJSON$44">#</a></span>  <code><strong>toJSON</strong></code><em>()</em>    </summary>  <a href=""></a>  <ul>    <p>      <p><strong>toJSON</strong><em>()</em>  &nbsp;=&gt;  <ul>{<p>  <details id="id$47" title="Property" ><summary><span><a href="#id$47">#</a></span>  <code><strong>id</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>string</p>        </ul></details><details id="loopPoints$49" title="Property" ><summary><span><a href="#loopPoints$49">#</a></span>  <code><strong>loopPoints</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><span>Float64Array</span></p>        </ul></details><details id="targets$48" title="Property" ><summary><span><a href="#targets$48">#</a></span>  <code><strong>targets</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><span>ImmSet</span>&lt;<a href="#SchedulerTarget$30">SchedulerTarget</a>&gt;</p>        </ul></details></p>}</ul></p></p>    </ul></details></p></ul></details><details id="SchedulerEventGroupNode$77" title="Class" ><summary><span><a href="#SchedulerEventGroupNode$77">#</a></span>  <code><strong>SchedulerEventGroupNode</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="constructor$78" title="Constructor" ><summary><span><a href="#constructor$78">#</a></span>  <code><strong>constructor</strong></code><em>(schedulerNode)</em>    </summary>  <a href=""></a>  <ul>    <p>  <details id="new SchedulerEventGroupNode$79" title="ConstructorSignature" ><summary><span><a href="#new SchedulerEventGroupNode$79">#</a></span>  <code><strong>new SchedulerEventGroupNode</strong></code><em>()</em>    </summary>    <ul><p><a href="#SchedulerEventGroupNode$77">SchedulerEventGroupNode</a></p>      <p>  <details id="schedulerNode$80" title="Parameter" ><summary><span><a href="#schedulerNode$80">#</a></span>  <code><strong>schedulerNode</strong></code>    </summary>    <ul><p><a href="#SchedulerNode$106">SchedulerNode</a></p>        </ul></details></p>  </ul></details></p>    </ul></details><details id="eventGroup$81" title="Property" ><summary><span><a href="#eventGroup$81">#</a></span>  <code><strong>eventGroup</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><a href="#SchedulerEventGroup$36">SchedulerEventGroup</a></p>        </ul></details><details id="onconnectchange$83" title="Property" ><summary><span><a href="#onconnectchange$83">#</a></span>  <code><strong>onconnectchange</strong></code>    </summary>  <a href=""></a>  <ul><p><details id="__type$84" title="Function" ><summary><span><a href="#__type$84">#</a></span>  <em>(ev)</em>    </summary>    <ul>    <p>    <details id="ev$86" title="Parameter" ><summary><span><a href="#ev$86">#</a></span>  <code><strong>ev</strong></code>    </summary>    <ul><p><span>CustomEvent</span>&lt;any&gt;</p>        </ul></details>  <p><strong></strong><em>(ev)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details></p>        </ul></details><details id="schedulerNode$87" title="Property" ><summary><span><a href="#schedulerNode$87">#</a></span>  <code><strong>schedulerNode</strong></code>    </summary>  <a href=""></a>  <ul><p><a href="#SchedulerNode$106">SchedulerNode</a></p>        </ul></details><details id="targetNodes$82" title="Property" ><summary><span><a href="#targetNodes$82">#</a></span>  <code><strong>targetNodes</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><span>Set</span>&lt;<a href="#SchedulerTargetNode$151">SchedulerTargetNode</a>&gt;</p>        </ul></details><details id="clear$96" title="Method" ><summary><span><a href="#clear$96">#</a></span>  <code><strong>clear</strong></code><em>()</em>    </summary>  <a href=""></a>  <ul>    <p>      <p><strong>clear</strong><em>()</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details><details id="connect$98" title="Method" ><summary><span><a href="#connect$98">#</a></span>  <code><strong>connect</strong></code><em>(targetNode)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="targetNode$100" title="Parameter" ><summary><span><a href="#targetNode$100">#</a></span>  <code><strong>targetNode</strong></code>    </summary>    <ul><p><a href="#SchedulerTargetNode$151">SchedulerTargetNode</a></p>        </ul></details>  <p><strong>connect</strong><em>(targetNode)</em>  &nbsp;=&gt;  <ul><a href="#SchedulerTargetNode$151">SchedulerTargetNode</a></ul></p></p>    </ul></details><details id="destroy$88" title="Method" ><summary><span><a href="#destroy$88">#</a></span>  <code><strong>destroy</strong></code><em>()</em>    </summary>  <a href=""></a>  <ul>    <p>      <p><strong>destroy</strong><em>()</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details><details id="disconnect$101" title="Method" ><summary><span><a href="#disconnect$101">#</a></span>  <code><strong>disconnect</strong></code><em>(targetNode)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="targetNode$103" title="Parameter" ><summary><span><a href="#targetNode$103">#</a></span>  <code><strong>targetNode</strong></code>    </summary>    <ul><p><a href="#SchedulerTargetNode$151">SchedulerTargetNode</a></p>        </ul></details>  <p><strong>disconnect</strong><em>(targetNode)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details><details id="resume$93" title="Method" ><summary><span><a href="#resume$93">#</a></span>  <code><strong>resume</strong></code><em>(targetNode)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="targetNode$95" title="Parameter" ><summary><span><a href="#targetNode$95">#</a></span>  <code><strong>targetNode</strong></code>    </summary>    <ul><p><a href="#SchedulerTargetNode$151">SchedulerTargetNode</a></p>        </ul></details>  <p><strong>resume</strong><em>(targetNode)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details><details id="suspend$90" title="Method" ><summary><span><a href="#suspend$90">#</a></span>  <code><strong>suspend</strong></code><em>(targetNode)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="targetNode$92" title="Parameter" ><summary><span><a href="#targetNode$92">#</a></span>  <code><strong>targetNode</strong></code>    </summary>    <ul><p><a href="#SchedulerTargetNode$151">SchedulerTargetNode</a></p>        </ul></details>  <p><strong>suspend</strong><em>(targetNode)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details></p></ul></details><details id="SchedulerNode$106" title="Class" ><summary><span><a href="#SchedulerNode$106">#</a></span>  <code><strong>SchedulerNode</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="constructor$114" title="Constructor" ><summary><span><a href="#constructor$114">#</a></span>  <code><strong>constructor</strong></code><em>(context)</em>    </summary>  <a href=""></a>  <ul>    <p>  <details id="new SchedulerNode$115" title="ConstructorSignature" ><summary><span><a href="#new SchedulerNode$115">#</a></span>  <code><strong>new SchedulerNode</strong></code><em>()</em>    </summary>    <ul><p><a href="#SchedulerNode$106">SchedulerNode</a></p>      <p>  <details id="context$116" title="Parameter" ><summary><span><a href="#context$116">#</a></span>  <code><strong>context</strong></code>    </summary>    <ul><p><span>BaseAudioContext</span></p>        </ul></details></p>  </ul></details></p>    </ul></details><details id="context$132" title="Property" ><summary><span><a href="#context$132">#</a></span>  <code><strong>context</strong></code>    </summary>  <a href=""></a>  <ul><p><span>BaseAudioContext</span></p>        </ul></details><details id="eventGroups$120" title="Property" ><summary><span><a href="#eventGroups$120">#</a></span>  <code><strong>eventGroups</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><span>SyncedSet</span>&lt;<a href="#SchedulerEventGroup$36">SchedulerEventGroup</a>, <a href="#SchedulerSyncedSetPayload$104">SchedulerSyncedSetPayload</a>&gt;</p>        </ul></details><details id="node$117" title="Property" ><summary><span><a href="#node$117">#</a></span>  <code><strong>node</strong></code>    </summary>  <a href=""></a>  <ul><p><span>AudioWorkletNode</span></p>        </ul></details><details id="targetNodes$119" title="Property" ><summary><span><a href="#targetNodes$119">#</a></span>  <code><strong>targetNodes</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><span>Set</span>&lt;<a href="#SchedulerTargetNode$151">SchedulerTargetNode</a>&gt;</p>        </ul></details><details id="worklet$118" title="Property" ><summary><span><a href="#worklet$118">#</a></span>  <code><strong>worklet</strong></code>    </summary>  <a href=""></a>  <ul><p><span>Agent</span>&lt;<span>SchedulerProcessor</span>, <a href="#SchedulerNode$106">SchedulerNode</a>&gt;</p>        </ul></details><details id="addEventGroup$121" title="Method" ><summary><span><a href="#addEventGroup$121">#</a></span>  <code><strong>addEventGroup</strong></code><em>(eventGroup)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="eventGroup$123" title="Parameter" ><summary><span><a href="#eventGroup$123">#</a></span>  <code><strong>eventGroup</strong></code>    </summary>    <ul><p><a href="#SchedulerEventGroup$36">SchedulerEventGroup</a></p>        </ul></details>  <p><strong>addEventGroup</strong><em>(eventGroup)</em>  &nbsp;=&gt;  <ul><a href="#SchedulerEventGroup$36">SchedulerEventGroup</a></ul></p></p>    </ul></details><details id="connect$145" title="Method" ><summary><span><a href="#connect$145">#</a></span>  <code><strong>connect</strong></code><em>(targetNode)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="targetNode$147" title="Parameter" ><summary><span><a href="#targetNode$147">#</a></span>  <code><strong>targetNode</strong></code>    </summary>    <ul><p><a href="#SchedulerTargetNode$151">SchedulerTargetNode</a></p>        </ul></details>  <p><strong>connect</strong><em>(targetNode)</em>  &nbsp;=&gt;  <ul><a href="#SchedulerTargetNode$151">SchedulerTargetNode</a></ul></p></p>    </ul></details><details id="disconnect$148" title="Method" ><summary><span><a href="#disconnect$148">#</a></span>  <code><strong>disconnect</strong></code><em>(targetNode)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="targetNode$150" title="Parameter" ><summary><span><a href="#targetNode$150">#</a></span>  <code><strong>targetNode</strong></code>    </summary>    <ul><p><a href="#SchedulerTargetNode$151">SchedulerTargetNode</a></p>        </ul></details>  <p><strong>disconnect</strong><em>(targetNode)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details><details id="removeEventGroup$124" title="Method" ><summary><span><a href="#removeEventGroup$124">#</a></span>  <code><strong>removeEventGroup</strong></code><em>(eventGroup)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="eventGroup$126" title="Parameter" ><summary><span><a href="#eventGroup$126">#</a></span>  <code><strong>eventGroup</strong></code>    </summary>    <ul><p><a href="#SchedulerEventGroup$36">SchedulerEventGroup</a></p>        </ul></details>  <p><strong>removeEventGroup</strong><em>(eventGroup)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details><details id="requestNextEvents$127" title="Method" ><summary><span><a href="#requestNextEvents$127">#</a></span>  <code><strong>requestNextEvents</strong></code><em>(eventGroupId, turn, total)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="eventGroupId$129" title="Parameter" ><summary><span><a href="#eventGroupId$129">#</a></span>  <code><strong>eventGroupId</strong></code>    </summary>    <ul><p>string</p>        </ul></details><details id="turn$130" title="Parameter" ><summary><span><a href="#turn$130">#</a></span>  <code><strong>turn</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>0</code></span>  </summary>    <ul><p>number</p>        </ul></details><details id="total$131" title="Parameter" ><summary><span><a href="#total$131">#</a></span>  <code><strong>total</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>4</code></span>  </summary>    <ul><p>number</p>        </ul></details>  <p><strong>requestNextEvents</strong><em>(eventGroupId, turn, total)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details><details id="seek$139" title="Method" ><summary><span><a href="#seek$139">#</a></span>  <code><strong>seek</strong></code><em>(seekTime)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="seekTime$141" title="Parameter" ><summary><span><a href="#seekTime$141">#</a></span>  <code><strong>seekTime</strong></code>    </summary>    <ul><p>number</p>        </ul></details>  <p><strong>seek</strong><em>(seekTime)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;number&gt;</ul></p></p>    </ul></details><details id="setBpm$142" title="Method" ><summary><span><a href="#setBpm$142">#</a></span>  <code><strong>setBpm</strong></code><em>(bpm)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="bpm$144" title="Parameter" ><summary><span><a href="#bpm$144">#</a></span>  <code><strong>bpm</strong></code>    </summary>    <ul><p>number</p>        </ul></details>  <p><strong>setBpm</strong><em>(bpm)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;number&gt;</ul></p></p>    </ul></details><details id="start$133" title="Method" ><summary><span><a href="#start$133">#</a></span>  <code><strong>start</strong></code><em>(playbackStartTime, offsetStartTime)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="playbackStartTime$135" title="Parameter" ><summary><span><a href="#playbackStartTime$135">#</a></span>  <code><strong>playbackStartTime</strong></code>    </summary>    <ul><p>number</p>        </ul></details><details id="offsetStartTime$136" title="Parameter" ><summary><span><a href="#offsetStartTime$136">#</a></span>  <code><strong>offsetStartTime</strong></code>    </summary>    <ul><p>number</p>        </ul></details>  <p><strong>start</strong><em>(playbackStartTime, offsetStartTime)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;number&gt;</ul></p></p>    </ul></details><details id="stop$137" title="Method" ><summary><span><a href="#stop$137">#</a></span>  <code><strong>stop</strong></code><em>()</em>    </summary>  <a href=""></a>  <ul>    <p>      <p><strong>stop</strong><em>()</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details><details id="create$111" title="Method" ><summary><span><a href="#create$111">#</a></span>  <code><strong>create</strong></code><em>(context)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="context$113" title="Parameter" ><summary><span><a href="#context$113">#</a></span>  <code><strong>context</strong></code>    </summary>    <ul><p><span>BaseAudioContext</span></p>        </ul></details>  <p><strong>create</strong><em>(context)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;<a href="#SchedulerNode$106">SchedulerNode</a>&gt;</ul></p></p>    </ul></details><details id="register$108" title="Method" ><summary><span><a href="#register$108">#</a></span>  <code><strong>register</strong></code><em>(context)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="context$110" title="Parameter" ><summary><span><a href="#context$110">#</a></span>  <code><strong>context</strong></code>    </summary>    <ul><p><span>BaseAudioContext</span></p>        </ul></details>  <p><strong>register</strong><em>(context)</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;void&gt;</ul></p></p>    </ul></details></p></ul></details><details id="SchedulerTarget$30" title="Class" ><summary><span><a href="#SchedulerTarget$30">#</a></span>  <code><strong>SchedulerTarget</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="constructor$31" title="Constructor" ><summary><span><a href="#constructor$31">#</a></span>  <code><strong>constructor</strong></code><em>(data)</em>    </summary>  <a href=""></a>  <ul>    <p>  <details id="new SchedulerTarget$32" title="ConstructorSignature" ><summary><span><a href="#new SchedulerTarget$32">#</a></span>  <code><strong>new SchedulerTarget</strong></code><em>()</em>    </summary>    <ul><p><a href="#SchedulerTarget$30">SchedulerTarget</a></p>      <p>  <details id="data$33" title="Parameter" ><summary><span><a href="#data$33">#</a></span>  <code><strong>data</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>{}</code></span>  </summary>    <ul><p><span>Partial</span>&lt;<a href="#SchedulerTarget$30">SchedulerTarget</a>&gt;</p>        </ul></details></p>  </ul></details></p>    </ul></details><details id="id$34" title="Property" ><summary><span><a href="#id$34">#</a></span>  <code><strong>id</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>string</p>        </ul></details><details id="midiQueue$35" title="Property" ><summary><span><a href="#midiQueue$35">#</a></span>  <code><strong>midiQueue</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><span>MessageQueue</span></p>        </ul></details></p></ul></details><details id="SchedulerTargetNode$151" title="Class" ><summary><span><a href="#SchedulerTargetNode$151">#</a></span>  <code><strong>SchedulerTargetNode</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="constructor$152" title="Constructor" ><summary><span><a href="#constructor$152">#</a></span>  <code><strong>constructor</strong></code><em>(context, name, options)</em>    </summary>  <a href=""></a>  <ul>    <p>  <details id="new SchedulerTargetNode$153" title="ConstructorSignature" ><summary><span><a href="#new SchedulerTargetNode$153">#</a></span>  <code><strong>new SchedulerTargetNode</strong></code><em>()</em>    </summary>    <ul><p><a href="#SchedulerTargetNode$151">SchedulerTargetNode</a></p>      <p>  <details id="context$154" title="Parameter" ><summary><span><a href="#context$154">#</a></span>  <code><strong>context</strong></code>    </summary>    <ul><p><span>BaseAudioContext</span></p>        </ul></details><details id="name$155" title="Parameter" ><summary><span><a href="#name$155">#</a></span>  <code><strong>name</strong></code>    </summary>    <ul><p>string</p>        </ul></details><details id="options$156" title="Parameter" ><summary><span><a href="#options$156">#</a></span>  <code><strong>options</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>{}</code></span>  </summary>    <ul><p><span>AudioWorkletNodeOptions</span></p>        </ul></details></p>  </ul></details></p>    </ul></details><details id="id$157" title="Property" ><summary><span><a href="#id$157">#</a></span>  <code><strong>id</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>string</p>        </ul></details><details id="schedulerTarget$158" title="Property" ><summary><span><a href="#schedulerTarget$158">#</a></span>  <code><strong>schedulerTarget</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p><a href="#SchedulerTarget$30">SchedulerTarget</a></p>        </ul></details><details id="worklet$159" title="Property" ><summary><span><a href="#worklet$159">#</a></span>  <code><strong>worklet</strong></code>    </summary>  <a href=""></a>  <ul><p><span>Agent</span>&lt;<span>SchedulerTargetProcessor</span>, <a href="#SchedulerTargetNode$151">SchedulerTargetNode</a>&gt;</p>        </ul></details><details id="init$160" title="Method" ><summary><span><a href="#init$160">#</a></span>  <code><strong>init</strong></code><em>()</em>    </summary>  <a href=""></a>  <ul>    <p>      <p><strong>init</strong><em>()</em>  &nbsp;=&gt;  <ul><span>Promise</span>&lt;void&gt;</ul></p></p>    </ul></details><details id="processMidiEvent$162" title="Method" ><summary><span><a href="#processMidiEvent$162">#</a></span>  <code><strong>processMidiEvent</strong></code><em>(midiEvent)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="midiEvent$164" title="Parameter" ><summary><span><a href="#midiEvent$164">#</a></span>  <code><strong>midiEvent</strong></code>    </summary>    <ul><p><span>MIDIMessageEvent</span></p>        </ul></details>  <p><strong>processMidiEvent</strong><em>(midiEvent)</em>  &nbsp;=&gt;  <ul>void</ul></p></p>    </ul></details></p></ul></details><details id="SchedulerSyncedSetPayload$104" title="Interface" ><summary><span><a href="#SchedulerSyncedSetPayload$104">#</a></span>  <code><strong>SchedulerSyncedSetPayload</strong></code>    </summary>  <a href=""></a>  <ul>        <p>  <details id="targets$105" title="Property" ><summary><span><a href="#targets$105">#</a></span>  <code><strong>targets</strong></code>    </summary>  <a href=""></a>  <ul><p><span>ImmSet</span>&lt;<a href="#SchedulerTarget$30">SchedulerTarget</a>&gt;</p>        </ul></details></p></ul></details><details id="LoopKind$12" title="TypeAlias" ><summary><span><a href="#LoopKind$12">#</a></span>  <code><strong>LoopKind</strong></code>    </summary>  <a href=""></a>  <ul><p><span>ValuesOf</span>&lt;typeof   <a href="#LoopKind$7">LoopKind</a>&gt;</p>        </ul></details><details id="NoteEvent$6" title="TypeAlias" ><summary><span><a href="#NoteEvent$6">#</a></span>  <code><strong>NoteEvent</strong></code>    </summary>  <a href=""></a>  <ul><p>[  number, number, number, number  ]</p>        </ul></details><details id="LoopKind$7" title="Variable" ><summary><span><a href="#LoopKind$7">#</a></span>  <code><strong>LoopKind</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>...</code></span>  </summary>  <a href=""></a>  <ul><p>{<p>  <details id="Live$11" title="Property" ><summary><span><a href="#Live$11">#</a></span>  <code><strong>Live</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>2</code></span>  </summary>  <a href=""></a>  <ul><p><code>2</code></p>        </ul></details><details id="Loop$10" title="Property" ><summary><span><a href="#Loop$10">#</a></span>  <code><strong>Loop</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>1</code></span>  </summary>  <a href=""></a>  <ul><p><code>1</code></p>        </ul></details><details id="Once$9" title="Property" ><summary><span><a href="#Once$9">#</a></span>  <code><strong>Once</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>0</code></span>  </summary>  <a href=""></a>  <ul><p><code>0</code></p>        </ul></details></p>}</p>        </ul></details><details id="getMidiEventsForNotes$1" title="Function" ><summary><span><a href="#getMidiEventsForNotes$1">#</a></span>  <code><strong>getMidiEventsForNotes</strong></code><em>(notes, bars, sampleRate)</em>    </summary>  <a href=""></a>  <ul>    <p>    <details id="notes$3" title="Parameter" ><summary><span><a href="#notes$3">#</a></span>  <code><strong>notes</strong></code>    </summary>    <ul><p><a href="#NoteEvent$6">NoteEvent</a>  []</p>        </ul></details><details id="bars$4" title="Parameter" ><summary><span><a href="#bars$4">#</a></span>  <code><strong>bars</strong></code>    </summary>    <ul><p>number</p>        </ul></details><details id="sampleRate$5" title="Parameter" ><summary><span><a href="#sampleRate$5">#</a></span>  <code><strong>sampleRate</strong></code>  <span><span>&nbsp;=&nbsp;</span>  <code>44100</code></span>  </summary>    <ul><p>number</p>        </ul></details>  <p><strong>getMidiEventsForNotes</strong><em>(notes, bars, sampleRate)</em>  &nbsp;=&gt;  <ul><span>MIDIMessageEvent</span>  []</ul></p></p>    </ul></details></p>

## Credits
- [alice-bob](https://npmjs.org/package/alice-bob) by [stagas](https://github.com/stagas) &ndash; transport agnostic strongly typed duplex rpc interfaces
- [event-toolkit](https://npmjs.org/package/event-toolkit) by [stagas](https://github.com/stagas) &ndash; Toolkit for DOM events.
- [everyday-types](https://npmjs.org/package/everyday-types) by [stagas](https://github.com/stagas) &ndash; Everyday utility types
- [everyday-utils](https://npmjs.org/package/everyday-utils) by [stagas](https://github.com/stagas) &ndash; Everyday utilities
- [immutable-map-set](https://npmjs.org/package/immutable-map-set) by [stagas](https://github.com/stagas) &ndash; Immutable Map and Set objects
- [json-objectify](https://npmjs.org/package/json-objectify) by [stagas](https://github.com/stagas) &ndash; Like JSON.stringify but without the stringify part.
- [serialize-whatever](https://npmjs.org/package/serialize-whatever) by [stagas](https://github.com/stagas) &ndash; Serialize and deserialize whatever.
- [synced-set](https://npmjs.org/package/synced-set) by [stagas](https://github.com/stagas) &ndash; Synchronize a Set collection of objects across a wire.
- [webaudio-tools](https://npmjs.org/package/webaudio-tools) by [stagas](https://github.com/stagas) &ndash; Useful tools for WebAudio.

## Contributing

[Fork](https://github.com/stagas/scheduler-node/fork) or [edit](https://github.dev/stagas/scheduler-node) and submit a PR.

All contributions are welcome!

## License

<a href="LICENSE">MIT</a> &copy; 2023 [stagas](https://github.com/stagas)
