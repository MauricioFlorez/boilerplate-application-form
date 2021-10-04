import React, { useState } from 'react';
import { Button, FlowBody, FlowWrapper, Box, Field, Input, Text, Title, Padding, Flexbox } from '@/ui';
import { useFormik } from 'formik';

interface Field {
  fieldId: string;
  name: string;
  label?: string;
  control: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'tel' | 'select' | 'date' | 'search' | 'react-select' | 'password';
  value?: string | number | null;
  appendText?: string;
  placeholder?: string;
  required: boolean;
  maxLength?: number;
  rule?: RegExp;
  error?: string;
  subFields?: Field[];
}
interface Section {
  id: string;
  heading: string;
  subHeading?: string;
  fields: Field[];
}
// Sample Mocked Data with form structure
const sections: Section[] = [
  {
    id: 'userProfile',
    heading: 'Who is the primary contact for this policy?',
    subHeading:
      'This person will receive all communications from Newfront about this policy. You can change this contact information later. If you´re not sure, just add your contact information.',
    fields: [
      {
        fieldId: 'fullName',
        name: 'fullName',
        label: 'Full name',
        control: 'Input',
        type: 'text',
        value: '',
        placeholder: '',
        required: true,
        rule: /^s*$/,
        error: 'Full name is required',
      },
      {
        fieldId: 'role',
        name: 'role',
        label: 'Role',
        control: 'Input',
        type: 'text',
        value: '',
        placeholder: '',
        required: false,
        rule: /^s*$/,
        error: 'Role is required',
      },
      {
        fieldId: 'phoneNumber',
        name: 'phoneNumber',
        label: 'Phone Number',
        control: 'Input',
        type: 'tel',
        value: '',
        placeholder: '',
        required: false,
      },
    ],
  },
  {
    id: 'companyProfile',
    heading: 'Tell us about your campany',
    subHeading:
      'This person will receive all communications from Newfront about this policy. You can change this contact information later. If you´re not sure, just add your contact information.',
    fields: [
      {
        fieldId: 'companyName',
        name: 'companyName',
        label: 'Company name',
        control: 'Input',
        type: 'text',
        value: '',
        placeholder: '',
        required: false,
      },
      {
        fieldId: 'FEIN',
        name: 'FEIN',
        label: 'What is your Federal Employer Number? (FEIN)',
        control: 'Input',
        type: 'number',
        value: '',
        placeholder: '',
        required: false,
      },
    ],
  },
  {
    id: 'employeeProfile',
    heading: 'Tell us about your people',
    fields: [
      {
        fieldId: 'employeeClinic',
        name: 'employeeClinic',
        label: 'What´s the name of the clinic, physician, or ER used for work injuries?',
        control: 'Input',
        type: 'text',
        value: '',
        placeholder: '',
        required: false,
      },
    ],
  },
];

export default function IndexPage(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [fieldValues, setFieldValues] = useState({});
  // emulating the flow behaviour - prefereably use the hooks created to manage the flow
  const stepsLimit = sections.length - 1;
  const fields = sections.map((section) => section.fields).flat();
  const formik = useFormik({
    // TODO: iterate over all fields and fill form initialValues dinamically
    initialValues: {
      fullName: '',
      role: '',
      phoneNumber: '',
      companyName: '',
      FEIN: '',
      employeeClinic: '',
    },
    onSubmit: (values) => {
      setFieldValues({ ...fieldValues, ...values });
      if (currentStep < stepsLimit) {
        setCurrentStep(currentStep + 1);
      } else {
        alert(JSON.stringify(fieldValues));
        console.log(fieldValues);
      }
    },
    validate: (values) => {
      // Initial proposal for building a custom validator relying on regex expressions and dynamic rules
      const errors = {};
      const valuesKey = Object.keys(values);
      valuesKey.forEach((key) => {
        const currentField = fields.find((elm) => elm.name === key);
        if (currentField?.rule?.test(values[key])) {
          errors[key] = currentField.error;
        }
      });
      return errors;
    },
  });
  const handleChange = (value: string, name: string): void => {
    // custom handler to update formik values with the format expected
    formik.handleChange({ target: { name, value } });
  };
  const previouskStep = (): void => {
    setCurrentStep(currentStep - 1);
  };
  return (
    <FlowWrapper>
      <FlowBody>
        {/* TODO: componetize the form builder - This is just a sample of the dynamic creation aproach */}
        {/* TODO: Implement a flow manger based on the API for the form schema response */}
        <form onSubmit={formik.handleSubmit}>
          {sections.map((section, idx) => {
            return (
              <React.Fragment key={section.id}>
                {currentStep === idx && (
                  <Box
                    borderTop={1}
                    borderRight={1}
                    borderLeft={1}
                    borderBottom={0}
                    borderTopRadius={10}
                    boxShadow="card"
                  >
                    <Padding size={40}>
                      <Title size={17} as="h1" style={{ paddingBottom: '17px' }}>
                        {section.heading}
                      </Title>
                      {section.subHeading && (
                        <Text size="regular" style={{ paddingBottom: '24px' }}>
                          {section.subHeading}
                        </Text>
                      )}
                      {section.fields.map((field) => {
                        return (
                          <Padding key={field.fieldId} bottom={12}>
                            <Field fieldId={field.fieldId} label={field.label} error={formik.errors[field.name]}>
                              {/* use an element instead of a hardcoded Input */}
                              <Input
                                name={field.name}
                                type={field.type}
                                onChange={handleChange}
                                value={formik.values[field.name]}
                              />
                            </Field>
                          </Padding>
                        );
                      })}
                    </Padding>
                  </Box>
                )}
              </React.Fragment>
            );
          })}
          <Box border={1} borderBottomRadius={10} boxShadow="card">
            <Padding top={32} bottom={32} left={40} right={40}>
              <Flexbox alignItems="center" justifyContent="space-between">
                {currentStep > 0 && (
                  <Button type="button" size="secondary" onClick={previouskStep}>
                    Back
                  </Button>
                )}
                <Button type="submit">{currentStep === stepsLimit ? 'Finish' : 'Next'}</Button>
              </Flexbox>
            </Padding>
          </Box>
        </form>
      </FlowBody>
    </FlowWrapper>
  );
}
