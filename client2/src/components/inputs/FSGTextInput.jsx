import { HStack, Input, Text } from "@chakra-ui/react";
import {
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
} from "@chakra-ui/form-control";
// import { updateGameField } from '../../../actions/devgame';
import { useEffect, useRef } from "react";
import { useBucket, useBucketSelector } from "../../../actions/bucket";
import { btFormFields } from "../../../actions/buckets";

function FSGTextInput(props) {
    // const inputChange = (e) => {
    //     let name = e.target.name;
    //     let value = e.target.value;

    //     updateGameField(name, value);
    // }

    const inputRef = useRef();

    let errors = props.useErrors ? props.useErrors(props.name) : [];
    errors = errors || [];

    let formValue = props.useValue
        ? props.useValue(props.name)
        : useBucketSelector(btFormFields, (form) =>
              form[props.group] && form[props.group][props.name]
                  ? form[props.group][props.name]
                  : null
          );
    useEffect(() => {
        if (props.focus) {
            setTimeout(() => {
                inputRef?.current?.focus();
            }, props.focusDelay || 300);
        }
    }, []);
    let value =
        typeof formValue !== "undefined" ? formValue : props.value || "";

    return (
        <FormControl as="fieldset" mb="0">
            <FormLabel as="legend" display={props.title ? "block" : "none"}>
                <HStack>
                    <Text
                        color={props.titleColor || "primary.10"}
                        fontSize={props.titleFontSize || "1.4rem"}
                        fontWeight={props.titleFontWeight || "500"}
                    >
                        {props.title}
                    </Text>
                    {props.required && (
                        <Text display="inline-block" color="red.500">
                            *
                        </Text>
                    )}
                </HStack>
            </FormLabel>
            <Input
                name={props.name}
                id={props.id}
                ref={props.ref || inputRef}
                placeholder={props.placeholder}
                fontWeight={props.fontWeight || "light"}
                fontSize={props.fontSize || "1.4rem"}
                color={props.color || "primary.10"}
                // pr={props.pr || 0}
                p={props.p || "1.5rem"}
                maxLength={props.maxLength}
                value={value || ""}
                size={props.size}
                isInvalid={errors.length > 0}
                width={props.width}
                border={props.border}
                height={props.height}
                onKeyPress={props.onKeyPress}
                onKeyUp={props.onKeyUp}
                boxShadow={props.boxShadow}
                borderRadius={props.borderRadius || "8px"}
                onKeyDown={props.onKeyDown}
                onChange={(e) => {
                    // if (props.rules && props.group) {
                    // updateGameField(props.name, e.target.value, props.rules, props.group, props.error);
                    // }
                    // props.onChange(e);
                    let fixedValue = e.target.value;
                    if (props.uppercase) fixedValue = fixedValue.toUpperCase();
                    if (props.regex)
                        fixedValue = fixedValue.replace(props.regex, "");
                    if (props.float)
                        fixedValue = fixedValue
                            .replace(/[^0-9.]/g, "")
                            .replace(/(\..*?)\..*/g, "$1");

                    if (props.onChange) props.onChange(e);
                    if (props.useTarget)
                        props.useTarget(props.name, fixedValue);
                }}
                onFocus={props.onFocus}
                disabled={props.disabled}
                autoComplete={props.autoComplete}
                _focus={{ ...props._focus }}
                _focusVisible={{ ...props._focusVisible }}
                _placeholder={{ ...props._placeholder }}
                bgColor={props.bgColor || "primary.950"}
            />

            {errors.length > 0 ? (
                errors.map((error) => (
                    <FormHelperText
                        fontSize="1.2rem"
                        color="red.300"
                        key={"error-" + props.name + "-" + error}
                    >
                        {error}
                    </FormHelperText>
                ))
            ) : (
                <FormHelperText fontSize="1.2rem" color="primary.50">
                    {props.helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
}

let onCustomWatched = (ownProps) => {
    if (ownProps.group) return [ownProps.group];
    return [];
};
let onCustomProps = (key, value, store, ownProps) => {
    // if (key == (ownProps.group + '>' + ownProps.name))
    //     return { [key]: value }
    return { value: value };
};

export default FSGTextInput;
// export default fs.connect([], onCustomWatched, onCustomProps)(FSGTextInput);
