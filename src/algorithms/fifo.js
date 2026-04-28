/**
 * FIFO (First-In, First-Out) Page Replacement Algorithm
 * Time Complexity: O(n) — iterate through reference string
 * Space Complexity: O(f) — f = number of frames
 *
 * Evicts the page that was loaded into memory first (oldest page).
 */

/**
 * @param {number[]} pages - Reference string array
 * @param {number} numFrames - Number of available frames
 * @returns {Object[]} steps - Array of step objects for animation
 */
export function runFIFO(pages, numFrames) {
  const steps = [];
  let frames = new Array(numFrames).fill(null); // current frame contents
  let pointer = 0; // next FIFO eviction index (circular)
  let hits = 0;
  let faults = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const framesBefore = [...frames];

    // Check if page is already in frames (HIT)
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
      // PAGE FAULT — find slot to evict
      faults++;
      const replacedIndex = pointer;
      frames[pointer] = page;
      pointer = (pointer + 1) % numFrames; // advance FIFO pointer

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
