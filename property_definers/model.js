

const BasicPropertyDefiner = require('./basic');
const library = require('../library');

class ModelPropertyDefiner extends BasicPropertyDefiner {
    assign() {
        this.instance[`_${this.key}`] = null;
    }

    check(value) {
        if (value !== null && !(value instanceof this.type || typeof value == 'object')) {
            throw this.createUncorrectTypeError(this, value, this.type.name + ' or null');
        }
    }

    setter() {
        return (value) => {
            this.check(value);
            this.instance[`_${this.key}`] = this.normalize(value);
            this.instance.dispatchEvent('change');
        };
    }

    getter() {
        return () => {
            const item = this.denormalize(this.instance[`_${this.key}`]);

            if (item) {
                item.addEventListener('change', () => {
                    // console.log('change', this.key);
                    this.instance[this.key] = item;
                });
            }
            return item;
        };
    }

    normalize(value) {
        if (typeof value == 'string') {
            return value;
        }

        if (typeof value === 'object') {
            value = new this.type(value);
        }
        if (value instanceof this.type) {
            value = value.serialize();
        }
        return value === null ? null : value.uuid;
    }

    denormalize(value) {
        if (!value) return null;

        value = library.get(this.type.name).get(value);
        if (this.options.through) {
            for (let index in this.options.through) {
                value[this.options.through[index]] = this.instance[this.options.through[index]];
            }
        }
        return new this.type(value);
    }
}

module.exports = ModelPropertyDefiner;