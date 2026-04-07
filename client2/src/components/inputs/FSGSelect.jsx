import { HStack, Input, Select, Switch, Text } from "@chakra-ui/react";
import {
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
} from "@chakra-ui/form-control";
import { updateGameField } from "../../../actions/devgame";
import { useEffect, useRef } from "react";
// import fs from "flatstore";
import { useBucketSelector } from "../../../actions/bucket";
import { btFormFields } from "../../../actions/buckets";

function FSGSelect(props) {
    // const inputChange = (e) => {
    //     let name = e.target.name;
    //     let value = e.target.value;

    //     updateGameField(name, value);
    // }

    const inputRef = useRef();

    useEffect(() => {
        if (props.focus) {
            setTimeout(() => {
                inputRef?.current?.focus();
            }, props.focusDelay || 300);
        }
    }, []);

    // let value = (props.group && props[props.group]) || props.value;

    let errors = props.useErrors ? props.useErrors(props.name) : [];
    errors = errors || [];
    let value = props.useValue
        ? props.useValue(props.name)
        : useBucketSelector(btFormFields, (form) =>
              form[props.group] && form[props.group][props.name]
                  ? form[props.group][props.name]
                  : null
          );
    value = value || "";

    return (
        <FormControl as="fieldset" mb="0">
            <FormLabel
                as="legend"
                fontSize="xs"
                color="primary.100"
                fontWeight="bold"
            >
                <HStack>
                    <Text
                        color={props.titleColor || "primary.10"}
                        fontSize={props.titleFontSize || "1.4rem"}
                        fontWeight={props.titleFontWeight || "500"}
                    >
                        {props.title}
                    </Text>
                    {props.required && (
                        <Text display="inline-block" color="red.800">
                            *
                        </Text>
                    )}
                </HStack>
            </FormLabel>

            <Select
                id={props.id}
                name={props.name}
                isInvalid={errors.length > 0}
                ref={props.ref || inputRef}
                value={value}
                onChange={(e) => {
                    // if (props.rules && props.group) {
                    //     updateGameField(
                    //         props.name,
                    //         e.target.value,
                    //         props.rules
                    //     );
                    // }
                    if (props.onChange) props.onChange(e);
                    if (props.useTarget)
                        props.useTarget(props.name, e.target.value);
                }}
                placeholder={props.placeholder}
                w={props.w || props.width}
                h={props.h || props.width || "3rem"}
                bgColor={props.bgColor || "primary.950"}
                fontSize={props.fontSize || "1.4rem"}
                borderRadius={props.borderRadius || "8px"}
                // defaultValue={props.defaultValue}
                disabled={props.disabled}
                onFocus={props.onFocus}
            >
                {props.options}
            </Select>

            {/* <Input
                name={props.name}
                id={props.id}
                ref={props.ref || inputRef}
                placeholder={props.placeholder}
                maxLength={props.maxLength}
                value={props.value || ''}
                size={props.size}
                width={props.width}
                onKeyDown={props.onKeyDown}
                onChange={props.onChange}
                onFocus={props.onFocus}
                disabled={props.disabled}
                bgColor="primary.800"
            /> */}

            {props.helperText && (
                <Text as="span" fontSize="1.2rem" color="primary.100">
                    {props.helperText}
                </Text>
            )}
            {errors.length > 0 ? (
                errors.map((error) => (
                    <FormHelperText
                        key={"error-" + props.name + "-" + error}
                        fontSize="1.2rem"
                        color="red.300"
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

// let onCustomWatched = (ownProps) => {
//     if (ownProps.group) return [ownProps.group];
//     return [];
// };
// let onCustomProps = (key, value, store, ownProps) => {
//     // if (key == (ownProps.group + '>' + ownProps.name))
//     //     return { [key]: value }
//     return { [ownProps.id]: value };
// };

export default FSGSelect;
