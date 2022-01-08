const transform = require("../src/transform.js");

class SchemaInstance {
  constructor(schema, opts = {}) {
    return class Schema {
      constructor(data) {
        setMethods(this, opts.methods);
        Object.keys(schema).forEach(setProperty(this, data));
      }
      static extend(extendedSchema, extendedOpts = {}) {
        return new SchemaInstance(
          { ...schema, ...extendedSchema },
          { methods: { ...opts.methods, ...extendedOpts.methods } }
        );
      }
      populate(data) {
        Object.keys(data).forEach(setProperty(this, data));
      }
      getSchema() {
        return schema;
      }
      toJson() {
        return JSON.stringify(this);
      }
      toObject() {
        return this;
      }
      customType(key, val, opts = {}) {
        // prop: [ T? ]
        // provided array brackets with type (optional)
        if (Array.isArray(opts)) {
          const arrayType = opts[0]; // String, Number, ...
          if (arrayType) {
            const newValues = [];
            val?.forEach((x) => {
              const newSchema = new SchemaInstance({
                x: arrayType,
              });
              const newModel = new newSchema({ x });
              newValues.push(newModel.x);
            });
            this[key] = newValues;
            return;
          } else {
            // prop: []
            opts.type = Array;
          }
        }

        const { type, default: defaultVal, enum: ENUM } = opts;

        // prop: { type: T }
        if (type) {
          // prop: { type: T, enum: [...] }
          if (ENUM) val = ENUM.includes(val) ? val : null;

          // set prop
          set(this, key, val, type, defaultVal);
        } else {
          // prop: SomeSchema (nested)
          const isSchema = schema[key].name == "Schema";
          const Nested = isSchema ? opts : new SchemaInstance(schema[key]);
          this[key] = new Nested(val);
        }
      }
    };
  }
}

module.exports = SchemaInstance;

const set = (instance, key, val, type, defaultVal) => {
  switch (type) {
    case String:
      instance[key] = transform.string(val, defaultVal);
      break;
    case Number:
      instance[key] = transform.number(val, defaultVal);
      break;
    case Date:
      instance[key] = transform.date(val, defaultVal);
      break;
    case Boolean:
      instance[key] = transform.bool(val, defaultVal);
      break;
    case Array:
      instance[key] = transform.array(val, defaultVal);
      break;
    case Object:
      instance[key] = transform.object(val, defaultVal);
      break;
    case "any":
      instance[key] = transform.any(val, defaultVal);
      break;
    default:
      instance.customType(key, val, type);
      break;
  }
};

const setMethods = (instance, methods) => {
  if (methods) {
    Object.keys(methods).forEach((key) => {
      const method = methods[key];
      if (typeof method === "function") instance[key] = methods[key];
    });
  }
};

const setProperty = (instance, data) => (key) => {
  const schema = instance.getSchema();
  const type = schema[key];
  if (type) {
    const val = data ? data[key] : null;
    set(instance, key, val, type);
  }
};
