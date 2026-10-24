# Virtual Science Laboratory

An interactive browser-based educational lab with Chemistry, Physics and Biology experiments. Each experiment runs on one shared simulation state, so the animation, instrument readings, live graph, data table, observation log, results and quiz all use the same data.

## Run it
No build step and no server needed: open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari).
Optional local server: `python3 -m http.server 8000` then visit http://localhost:8000.
Run model tests (Node 18+, no dependencies): `node tests/models.test.js`

## Project structure
```
index.html              Page markup (intro, lab selection, lab workspace)
css/styles.css          Styles, light/dark theme tokens
js/core.js              Utilities, least-squares fit, drawing helpers, EX experiment registry
js/audio.js             Web Audio synthesised equipment sounds, volume and mute
js/experiments/
  chemistry.js          Titration, CO2 gas collection, precipitation
  physics.js            Hooke's law, simple pendulum, Ohm's law
  biology.js            Osmosis, diffusion in agar, photosynthesis
js/graph.js             Canvas graph renderer (axes, markers, fit lines)
js/quiz.js              Quiz UI and automatic marking
js/engine.js            Shared state, time loop, log, table/result sync
js/app.js               Navigation, lab cards, event wiring
tests/models.test.js    Automated tests of models and quiz data
```
Scripts are classic (non-module) scripts loaded in the order listed in `index.html`, so the project also works when opened directly from disk.

## Adding an experiment
Add an object to `Object.assign(EX,{...})` in the relevant file under `js/experiments/` with: `lab, title, cols, obj, bg, app, saf, steps, model, init(), ctl(S), step(S,dt), chk(S), graph(S), res(S), draw(ctx,S), quiz`. Its id must start with `chem`, `phys` or `bio` to appear on that lab's card.

## Implemented experiments
| Lab | Experiment | Live graph |
|---|---|---|
| Chemistry | Acid-base titration (HCl + NaOH) | pH vs volume |
| Chemistry | Acid + carbonate, CO2 collected in a gas syringe | gas volume vs time |
| Chemistry | Precipitation, CaCl2 + Na2CO3 (continuous variation) | precipitate mass vs volume |
| Physics | Hooke's law | force vs extension, best-fit k |
| Physics | Simple pendulum | T^2 vs L, best-fit g |
| Physics | Ohm's law with power-rating trip | V vs I per resistor |
| Biology | Osmosis in potato tissue | mass vs time per concentration |
| Biology | Diffusion in agar vs temperature | distance vs time per temperature |
| Biology | Photosynthesis vs light intensity | bubbles/min vs intensity |

Every experiment has an objective, background equations, apparatus, safety notes, step list, model assumptions, observation log, completion condition, and a 5-question quiz (20 marks each; Excellent >= 90%, Good >= 70%, Satisfactory >= 50%, otherwise Needs Improvement). Best quiz scores are saved in the browser (localStorage); experiment data lives for the session.

## Audio and visuals
Sounds are synthesised with the Web Audio API (clicks, metal clinks, drips, beeps) and play only on user actions; audio starts after the first click to satisfy browser autoplay rules. Visuals are Canvas 2D drawings driven by the simulation state; pausing freezes both time and animation. `prefers-reduced-motion` makes the spring settle instantly.

## Dependencies
None. No external libraries, fonts, images or network access.

## Test status
`node tests/models.test.js` checks the titration pH values, gas and precipitate stoichiometry, osmosis model, least-squares fit, spring equilibrium, pendulum period and derived g, quiz data validity and scoring categories: 54 checks, all passing when last run. The browser interface (canvas drawing, buttons, audio, layout on phones) has NOT been tested in a real browser in this environment.

## Known limitations
- 2D canvas drawings, not 3D/WebGL models.
- Simplified educational models (documented per experiment in the panel); simulated data are not real measurements.
- No microscope, dissection, optics, oscilloscope or circuit-builder experiments yet.
- No CSV/PNG export, no keyboard-accessible apparatus manipulation beyond the buttons, no drag-and-drop equipment placement.
- Not a substitute for supervised laboratory work or PPE.
