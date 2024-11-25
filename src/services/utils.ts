/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function debounce(func: Function, delay: number){
  let timeout: NodeJS.Timeout | null;

  return (...args: any) => {
        if(timeout) clearTimeout(timeout)

        timeout=setTimeout(() => {
            func(...args)
            timeout=null
        }, delay)
    }
}