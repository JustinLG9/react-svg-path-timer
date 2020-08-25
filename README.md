Timer made with an SVG path. Easily display a timer in a more fun and eye-capturing way!

# Props

=========
| Prop | Type | Description | Default | Required |
| -------------------- | ------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------- |
| `time` | Number | Time in seconds for timer to countdown from | 30 | No |
| `active` | Boolean | Timer will only run while active is `true` | true | No |
| `resetOnChange` | any | Anytime this value is changed the timer will reset. Recommend using a number that increments by 1. | null | No |
| `finishCallback` | func | Callback to be run when timer hits zero | () => {} | No |
| `d` | String | The path to be drawn. Follows standard path commands for an SVG path | "M 0 0 a 50 50 0 1 0 0.001 0 z" (circle) | No |
| `direction` | String | Reverses direction of path movement when set to "backwards" | "forwards" | No |
| `strokeColor` | String | Color of the timer stroke | "white" | No |
| `pathColor` | String | Color of the path the timer stroke follows. Can be set to "none" if unwanted. | "grey" | No |
| `strokeWidth` | Number | The width of the path stroke | 1 | No |
| `strokeLinecap` | String | Can use any standard SVG path linecap | "butt" | No |
| `fill` | String | Color to fill the drawn path with | "none" | No |
| `digitalTimer` | Boolean | Displays a digital timer in the center of the path | true | No |
| `digitalTimerStyles` | Object | Used to add styles to the digital timer. Can be useful to move timer if your path crosses over it. | {} | No |
| `height` | String | Specifies height in any standard unit | "100%" | No |
| `width` | String | Specifies width in any standard unit | "100%" | No |
