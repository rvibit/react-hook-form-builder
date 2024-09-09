import { memo, useState } from "react";
import { useStateMachine } from "little-state-machine";
import FormFields from "./FormFields";
import { useForm, SubmitHandler } from "react-hook-form";
import buttonStyles from "../styles/button.module.css";
import styles from "./Form.module.css";

function FormComponent({ formUpdated }: { formUpdated: boolean }) {
  const [submitData, updateSubmitData] = useState({});
  const { register, handleSubmit, formState, reset } = useForm();

  const touched = Object.keys(formState.touchedFields || {});
  const {
    state: { formData },
  } = useStateMachine();
  const errors = formState.errors;

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <>
      <form className={styles.demoForm} onSubmit={handleSubmit(onSubmit)}>
        <FormFields {...{ formData, errors, register }} />
        <button className={buttonStyles.pinkButton}>Submit</button>
      </form>
    </>
  );
}

export const Form = memo(FormComponent);
