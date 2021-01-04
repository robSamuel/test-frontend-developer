export default class ArrayUtils {
    static isNotEmpty(arr) {
        return Array.isArray(arr) && !!arr.length;
    }
}
