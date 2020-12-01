import moment from 'moment';
import S from 'string';

const FORMAT = 'DD/MM/YYYY';

export class DateUtils {
    static format(value, format = FORMAT) {
        if (
            (typeof value === 'string' && !S(value).isEmpty()) ||
            (typeof value === 'object' && value instanceof Date)
        ) {
            return moment(value).format(format);
        } else if (typeof value === 'object' && moment.isMoment(value)) {
            return value.format(format);
        }

        return null;
    }
}
