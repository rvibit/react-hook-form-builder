import { Animate } from "react-simple-animate";
import { useForm } from "react-hook-form";
import SortableContainer from "./SortableContainer";
import { useStateMachine } from "little-state-machine";
import colors from "../styles/colors";
import builder from "../data/builder";
import buttonStyles from "../styles/button.module.css";
import typographyStyles from "../styles/typography.module.css";
import { useState, useRef, useEffect, memo, RefObject } from "react";
import styles from "./BuilderPage.module.css";
import { Form } from "./Form";

const errorStyle = {
  border: `1px solid ${colors.secondary}`,
  background: colors.errorPink,
};

const defaultValue = {
  max: undefined,
  min: undefined,
  pattern: undefined,
  maxLength: undefined,
  minLength: undefined,
  required: undefined,
  name: "",
  type: "",
  options: [],
};

export function BuilderPage({
  showBuilder,
  isStatic,
}: {
  showBuilder?: boolean;
  toggleBuilder?: (state: boolean) => void;
  HomeRef?: RefObject<HTMLDivElement>;
  isStatic?: boolean;
}) {
  const {
    state: { formData = [] },
    actions: { updateFormData },
  } = useStateMachine({
    updateFormData: (state, payload) => {
      return {
        ...state,
        formData: [...payload],
      };
    },
  });
  const [editFormData, setFormData] = useState(defaultValue);
  const { register, handleSubmit, watch, setValue, reset, formState } =
    useForm();
  const errors = formState.errors;
  const [editIndex, setEditIndex] = useState(-1);
  const copyFormData = useRef([]);
  const [showValidation, toggleValidation] = useState(false);
  const onSubmit = (data) => {
    toggleValidation(false);
    if (editIndex >= 0) {
      formData[editIndex] = data;
      updateFormData([...formData.filter((formInput) => formInput)]);
      setFormData(defaultValue);
      setEditIndex(-1);
    } else {
      updateFormData([...formData, ...[data]]);
    }
    reset();
  };
  const form = useRef<HTMLHeadingElement>(null);
  const type = watch("type");
  const shouldToggleOn =
    editFormData.max ||
    editFormData.min ||
    editFormData.pattern ||
    editFormData.maxLength ||
    editFormData.minLength ||
    editFormData.required;
  copyFormData.current = formData;
  const editIndexRef = useRef(null);
  editIndexRef.current = editIndex;

  const validate = (value) => {
    return (
      !Object.values(copyFormData.current).find(
        (data) => data.name === value,
      ) || editIndexRef.current !== -1
    );
  };

  useEffect(() => {
    setValue("toggle", shouldToggleOn);
  }, [shouldToggleOn]);

  useEffect(() => {
    if (editFormData.type) setValue("type", editFormData.type);
  }, [editFormData.type]);

  useEffect(() => {
    setValue("required", editFormData.required);
  }, [editIndex]);

  const child = (
    <div>
      <h1 className={typographyStyles.headingWithTopMargin} id="main">
        {builder.builder.title}
      </h1>
      <p className={typographyStyles.subHeading}>
        {builder.builder.description}
      </p>

      <div className={styles.pageWrapper}>
        <section>
          <h2 className={typographyStyles.title}>{builder.layout.title}</h2>

          <p style={{ fontSize: 14 }}>{builder.layout.message}</p>

          <SortableContainer
            {...{
              updateFormData,
              formData,
              editIndex,
              setEditIndex,
              setFormData,
              editFormData,
              reset,
            }}
          />
        </section>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h2 className={typographyStyles.title} ref={form}>
            {builder.inputCreator.title}
          </h2>

          <p style={{ fontSize: 14 }}>{builder.inputCreator.description}</p>

          <label>Name: </label>
          <input
            autoComplete="off"
            defaultValue={editFormData.name}
            aria-label="name"
            aria-invalid={errors["name"] ? "true" : "false"}
            style={{
              ...(errors["name"] ? errorStyle : null),
            }}
            {...register("name", { required: true, validate })}
          />
          <Animate
            play={!!errors["name"]}
            duration={0.6}
            start={{
              maxHeight: 0,
            }}
            end={{ maxHeight: 20 }}
          >
            {errors.name && errors.name["type"] === "required" && (
              <p className={typographyStyles.error}>This is required.</p>
            )}
            {errors.name && errors.name["type"] === "validate" && (
              <p className={typographyStyles.error}>
                Name required to be unique.
              </p>
            )}
          </Animate>

          <label>Type: </label>
          <select
            aria-label="Select type"
            {...register("type", { required: false })}
            defaultValue={editFormData.type}
          >
            <option value="text">Text</option>
            <option value="password">Password</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="number">Number</option>
            <option value="textarea">Textarea</option>
            <option value="email">Email</option>
            <option value="range">Range</option>
            <option value="search">Search</option>
            <option value="tel">Tel</option>
            <option value="url">url</option>
            <option value="time">Time</option>
            <option value="datetime">datetime</option>
            <option value="datetime-local">datetime-local</option>
            <option value="week">week</option>
            <option value="month">month</option>
            <option value="validate" disabled>
              validate
            </option>
          </select>

          {(type === "select" ||
            type === "radio" ||
            editFormData.type === "select" ||
            editFormData.type === "radio") && (
            <>
              <label>{builder.inputCreator.options}:</label>
              <input
                key={editFormData.name}
                defaultValue={editFormData.options}
                type="text"
                placeholder="Enter options separate by ;"
                {...register("options", {
                  required: true,
                })}
              />
              <Animate
                play={!!errors["options"]}
                duration={0.6}
                start={{
                  maxHeight: 0,
                }}
                end={{ maxHeight: 20 }}
              >
                {errors.options && errors.options["type"] === "required" && (
                  <p className={typographyStyles.error}>This is required.</p>
                )}
              </Animate>
            </>
          )}

          <label>
            <input
              type="checkbox"
              {...register("toggle", { required: false })}
              onClick={() => toggleValidation(!showValidation)}
            />
            {builder.inputCreator.validation}
          </label>

          <Animate
            play={shouldToggleOn || showValidation}
            start={{
              maxHeight: 0,
              overflow: "hidden",
            }}
            end={{
              maxHeight: 800,
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <fieldset>
              <label
                style={{
                  marginTop: 0,
                }}
              >
                <input
                  type="checkbox"
                  {...register("required", { required: false })}
                />
                Required
              </label>
              <label htmlFor="max">Max</label>
              <input
                defaultValue={editFormData.max}
                aria-label="max"
                autoComplete="false"
                type="number"
                {...register("max", { required: false })}
              />
              <label htmlFor="min">Min</label>
              <input
                defaultValue={editFormData.min}
                autoComplete="false"
                aria-label="min"
                type="number"
                {...register("min", { required: false })}
              />
              <label htmlFor="maxLength">MaxLength</label>
              <input
                defaultValue={editFormData.maxLength}
                autoComplete="false"
                aria-label="max length"
                type="number"
                {...register("maxLength", { required: false })}
              />
              <label htmlFor="pattern">Pattern</label>
              <input
                autoComplete="false"
                defaultValue={editFormData.pattern}
                style={{
                  marginBottom: "20px",
                }}
                aria-label="pattern"
                type="text"
                {...register("pattern", { required: false })}
              />
            </fieldset>
          </Animate>

          <button
            className={buttonStyles.pinkButton}
            onClick={() => {
              form?.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {editIndex >= 0 ? "Update" : "Create"}
          </button>

          {formData.length > 0 && (
            <h2
              className={typographyStyles.title}
              style={{
                fontSize: 14,
                maxWidth: "80%",
                margin: "0 auto 0",
              }}
            >
              or
            </h2>
          )}
        </form>

        <section
          style={{
            paddingRight: "20px",
            position: "relative",
          }}
        >
          <h2 className={typographyStyles.title}>{builder.code.title}</h2>

          <p style={{ fontSize: 14 }}>{builder.code.description}</p>
          <Form />
        </section>
      </div>
    </div>
  );

  if (isStatic) return child;

  return (
    <Animate
      play={showBuilder || isStatic}
      easeType="ease-in"
      duration={0.5}
      start={{
        transform: "translateY(100vh)",
      }}
      end={{
        transform: "translateY(0)",
      }}
      render={({ style }) => (
        <main className={styles.root} style={style}>
          <div
            id="builder"
            style={{
              overflow: "auto",
              height: "100vh",
              background: colors.primary,
            }}
          >
            {child}
          </div>
        </main>
      )}
    />
  );
}

export default memo(BuilderPage);
