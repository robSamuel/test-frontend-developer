import S from 'string';

export default class StringUtils {
    static isEmpty(value) {
        if (Array.isArray(value)) {
            for (const item of value) {
                if (S(item).isEmpty()) {
                    return true;
                }
            }

            return false;
        }

        return S(value).isEmpty();
    }
}
