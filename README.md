# Pixel Dash DX

## V26 updates

- Full playable build, not a placeholder.
- Smooth gravity transition: objects animate top-to-bottom after a gravity portal.
- Player moves to ceiling/floor lane while camera and HUD stay normal.
- Editor remains included.


## V24 updates

- Fixed gravity properly: physics flips, not the camera/world.
- Removed the upside-down mirrored canvas effect.
- Player rotates upside down while the level stays readable.
- Gravity portals move the cube safely to the ceiling/floor lane.
- Pads and objects stay where the editor placed them.


## V23 updates

- Gravity portals now flip the whole gameplay view upside down.
- Player, pads, blocks, spikes, portals, and background all render inverted together.
- HUD/menu stay readable and normal.


## V22 updates

- Fixed pads moving to the ceiling after gravity flips.
- Pads, orbs, blocks, and portals now stay where the level editor places them.
- Gravity portals only flip the player and move the player safely into the opposite lane.
- Air blocks and ground blocks keep separate gameplay positions.


## V21 updates

- Level editor now supports Air Blocks.
- Use B / AIR BLOCK to place blocks in the air row.
- Ground blocks still use #.
- Air blocks appear and collide in gameplay.


## V20 updates

- Fixed Level Editor button not opening.
- Rebuilt HTML overlay structure so menu/editor/game layers work correctly.
- Adjusted starting level maps so the game no longer appears as an empty screen after pressing Start.
- Kept the GD-style visual editor.


## V19 updates

- Upgraded the temporary level editor to feel more like a Geometry Dash-style visual editor.
- Added object palette, grid canvas, click-to-place objects, erase tool, and stage selector.
- Raw map text remains available for copying/editing.
- Use COPY LEVELS when finished so the next build can remove the editor and keep the final maps.


## V18 updates

- Added a temporary level editor for the five main levels.
- Edit stage maps directly using symbols: . empty, ^ spike, # block, _ pit, o orb, p pad, g gravity portal.
- Save to a stage, test immediately in Practice mode, and copy all final level maps.
- Next update can remove this editor and hard-code your finished levels.


## V17 updates

- Gravity portals now move the player safely into the new gravity lane instead of into the ground.
- Added a visible ceiling lane for upside-down gameplay.
- Portal sections now appear in pairs so upside-down sections are useful.
- Pads work on ceiling/floor based on gravity.
- Levels were adjusted so portals are more helpful and intentional.


## V16 updates

- Practice checkpoints respawn exactly where they were placed, including in mid-air.
- Checkpoints store player Y position, velocity, gravity direction, and rotation.
- Includes jump orbs, jump pads, gravity portals, and standable blocks.


## V14 updates

- Practice checkpoints are now manually placed.
- Press X or tap SET CHECKPOINT to place a checkpoint.
- Press Z or tap DELETE CHECKPOINT to remove the previous checkpoint.
- Mobile-friendly practice buttons appear at the bottom of the screen in Practice mode.


## V13 updates

- On crash, the game pauses for 0.5 seconds before showing the crash menu.
- During that 0.5 seconds, hitboxes are shown so players can see what happened.
- Hitboxes are hidden again when retrying, restarting, or going back to the menu.
- Crash menu remains: CRASH! / Try again or pick another stage / TRY AGAIN / MENU.


## V12 updates

- Forest Quest now has pixel trees.
- Midnight Castle now has spooky castle silhouettes and moon details.
- Other worlds get extra theme-specific background details.
- Practice mode now uses visible floating mini-player checkpoints.
- Passing a checkpoint activates it and future practice deaths restart from that checkpoint.
 v12

A tiny 8-bit "impossible runner" web game you can publish for free with GitHub Pages.

## V10 updates

- Replaced charge/release robot jump with true hold-to-rise robot behavior
- Jump starts immediately on press
- Holding jump keeps the player rising briefly
- Releasing jump cuts the rise
- Max hold height is capped to keep it closer to Geometry Dash-style robot limits

## V9 updates

- Fixed start/music buttons after the robot-mode input change
- Added hybrid robot jumping: tap for small jump, hold/release for bigger jump
- Added squish animation while charging
- Added rising charge sound
- Added slight screen shake on full-charge release
- Bigger jumps now create stronger particles

## V7 updates

- Stage name in the top-left is now clickable and opens the menu
- Escape now opens the menu directly
- Death screen now has clear Try Again and Menu buttons
- Game modes simplified to Normal, Turbo, and Practice
- Levels are roughly 3x longer
- Music phrases are longer and more song-like per stage
- Sound effects are more theme-specific and retro-console-like
- Art style intentionally unchanged

## V5 updates

- Every stage now has a different song instead of reusing the same pattern
- Added game modes: Classic, Practice, Zen, and Turbo
- Practice mode uses checkpoints so you restart from recent progress
- Zen mode lets you keep playing after crashes
- Turbo mode is faster

## V4 updates

- Added a 3-frame jump buffer: if you press jump just before landing, the jump triggers when you hit the ground

## V3 updates

- Combined theme/world and level into a single stage selector
- Each stage now has its own matching theme and music
- Escape pauses/resumes
- Removed the red spike markings that looked like hitboxes
- Simplified the UI into a menu screen
- Game area now gets nearly the full screen
- Minimal in-game HUD only

## How to play

- Space / click / tap to jump
- Escape to pause/resume
- R to restart
- Avoid spikes, blocks, and pits
- Try Random Run for a generated level

## How to publish with GitHub Pages

1. Create a free GitHub account.
2. Create a new public repository, such as `pixel-dash`.
3. Upload `index.html`, `style.css`, and `game.js`.
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Save.
7. GitHub will give you a public link after it deploys.

## Copyright note

This project uses original names, simple generated audio, and simple geometric graphics. The theme names are retro-inspired without using copyrighted characters, music, logos, sprites, or exact level designs.
