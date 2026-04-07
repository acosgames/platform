import { HStack, Input, Switch, Text, VStack } from "@chakra-ui/react";
import {
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
} from "@chakra-ui/form-control";
import { updateGameField } from "../../../actions/devgame";
import { useEffect, useRef } from "react";
import fs from "flatstore";
import { useBucketSelector } from "../../../actions/bucket";
import { btFormFields } from "../../../actions/buckets";

export default function FSGSwitch(props) {
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

    let errors = props.useErrors ? props.useErrors(props.name) : [];
    errors = errors || [];
    // let value = (props.group && props[props.group]) || props.value;
    let value = props.useValue
        ? props.useValue(props.name)
        : useBucketSelector(btFormFields, (form) =>
              form[props.group] && form[props.group][props.name]
                  ? form[props.group][props.name]
                  : null
          );
    value = value || "";

    let DirectionComponent = VStack;
    if (props.horizontal) {
        DirectionComponent = HStack;
    }
    return (
        <FormControl as="fieldset" mb="0">
            <DirectionComponent
                w="100%"
                justifyContent={"center"}
                alignItems={"center"}
            >
                <FormLabel
                    as="legend"
                    fontSize="xs"
                    color="primary.100"
                    fontWeight="bold"
                >
                    <HStack>
                        <Text
                            color={"primary.10"}
                            fontSize="1.4rem"
                            fontWeight="500"
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
                <Switch
                    id={props.id}
                    size={props.size || "lg"}
                    name={props.name}
                    ref={props.ref || inputRef}
                    placeholder={props.placeholder}
                    value={value || false}
                    isChecked={value || false}
                    onChange={(e) => {
                        // if (props.rules && props.group) {
                        //     updateGameField(
                        //         props.name,
                        //         e.target.checked,
                        //         props.rules,
                        //         props.group,
                        //         props.error
                        //     );
                        // }
                        if (props.onChange) props.onChange(e);
                        if (props.useTarget)
                            props.useTarget(props.name, e.target.checked);
                    }}
                    onFocus={props.onFocus}
                    disabled={props.disabled}
                />
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
            </DirectionComponent>
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

// let onCustomWatched = ownProps => {
//     if (ownProps.group)
//         return [ownProps.group];
//     return [];
// };
// let onCustomProps = (key, value, store, ownProps) => {
//     // if (key == (ownProps.group + '>' + ownProps.name))
//     //     return { [key]: value }
//     return { 'value': value };
// };

// export default fs.connect([], onCustomWatched, onCustomProps)(FSGSwitch);
