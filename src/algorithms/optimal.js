/**
 * Optimal Page Replacement Algorithm (Bélády's Algorithm)
 * Time Complexity: O(n² * f) — look-ahead scan for each fault
 * Space Complexity: O(f) — f = number of frames
 *
 * Evicts the page that won't be used for the longest time in the future.
 * Produces the minimum possible page faults — used as a benchmark.
 */

/**
 * @param {number[]} pages - Reference string array
 * @param {number} numFrames - Number of available frames
 * @returns {Object[]} steps - Array of step objects for animation
 */
export function runOptimal(pages, numFrames) {
  const steps = [];
  let frames = new Array(numFrames).fill(null);
  let hits = 0;
  let faults = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    // Check for HIT
    const hitIndex = frames.indexOf(page);
    if (hitIndex !== -1) {
      hits++;
      steps.push({
        stepIndex: i,
        page,
        frames: [...frames],
        fault: false,
        hitFrameIndex: hitIndex,
        replacedIndex: -1,
        faultCount: faults,
        hitCount: hits,
      });
    } else {
      // PAGE FAULT
      faults++;
      let replacedIndex;

      // Check for empty frames first
      const emptySlot = frames.indexOf(null);
      if (emptySlot !== -1) {
        replacedIndex = emptySlot;
      } else {
        // Look ahead: find the page used furthest in the future
        let farthest = -1;
        replacedIndex = 0;

        for (let j = 0; j < numFrames; j++) {
          // Find next use of frames[j] after position i
          let nextUse = Infinity;
          for (let k = i + 1; k < pages.length; k++) {
            if (pages[k] === frames[j]) {
              nextUse = k;
              break;
            }
          }
          // Pick the frame whose next use is furthest away
          if (nextUse > farthest) {
            farthest = nextUse;
            replacedIndex = j;
          }
        }
      }

      frames[replacedIndex] = page;

      steps.push({
        stepIndex: i,
        page,
        frames: [...frames],
        fault: true,
        hitFrameIndex: -1,
        replacedIndex,
        faultCount: faults,
        hitCount: hits,
      });
    }
  }

  return steps;
}
