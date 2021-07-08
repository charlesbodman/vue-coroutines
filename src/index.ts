import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class VueCoroutines extends Vue {
  /**
   * Flag to stopping coroutine runner
   */
  private running: boolean = false;

  /**
   * Before Destroy - called before component is destroyed
   * Vue lifecycle method
   */
  public beforeDestroy() {
    this.running = false;
  }

  /**
   * Starts a coroutine/generator function
   *
   * @param {IterableIterator<any>} generator - generator to run
   */
  public startCoroutine(generator: IterableIterator<any>) {
    this.running = true;
    this.runCoroutine(generator);
  }

  /**
   * Stops all coroutines
   */
  public stopAllCoroutines() {
    this.running = false;
  }

  /**
   * Runs the coroutine
   *
   * @param {IterableIterator<any>} generator - generator iterator to run
   */
  private runCoroutine(generator: IterableIterator<any>) {
    let generatorReturn: IteratorResult<any>;
    const component = this;
    /**
     * Iterate
     *
     * @param {any} val - val
     */
    function iterate(val: any) {
      generatorReturn = generator.next(val);

      if (!generatorReturn.done && component.running) {
        if ('then' in generatorReturn.value) {
          // wait on the promise
          generatorReturn.value.then(iterate);
        } else {
          // avoid synchronous recursion
          setTimeout(() => { iterate(generatorReturn.value); }, 0);
        }
      }
    }

    iterate(undefined);
  }
}

/**
 * Wait helper function
 *
 * @param {number} milliseconds - milliseconds to wait
 * @returns {Promise<void>} promise
 */
export function wait(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
