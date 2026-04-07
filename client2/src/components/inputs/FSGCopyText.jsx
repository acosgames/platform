import { HStack, Input, Text } from "@chakra-ui/react";
import {
    FormControl,
    FormLabel,
    FormHelperText,
} from "@chakra-ui/form-control";
import { updateGameField } from "../../../actions/devgame";

function FSGCopyText(props) {
    // const inputChange = (e) => {
    //     let name = e.target.name;
    //     let value = e.target.value;

    //     updateGameField(name, value);
    // }

    return (
        <Input
            name={props.name}
            id={props.id}
            ref={props.copyRef}
            value={props.value || ""}
            width={props.width}
            maxWidth={props.maxWidth}
            onFocus={props.onFocus}
            fontSize={props.fontSize || "12px"}
            fontWeight={props.fontWeight}
            height={props.height || "3rem"}
            borderRadius={props.borderRadius}
            readOnly
            size="xs"
            color={props.color || "primary.100"}
            bgColor={props.bgColor || "primary.800"}
            borderColor={props.borderColor || "primary.800"}
            outlineColor={props.outlineColor || "primary.800"}
            _hover={{ borderColor: "primary.800" }}
        />
    );
}

export default FSGCopyText;
