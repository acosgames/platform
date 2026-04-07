
import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/form-control";
import { useColorModeValue, VStack, Heading, StackDivider, Text } from "@chakra-ui/react";

function FSGGroup(props) {

    const borderColor = useColorModeValue('red.500', 'red.200')

    return (
        <VStack align='stretch' width={props.width || "100%"} py={props.py || 0} px={props.px || 0}>
            <Text
                as={props.as || 'span'}
                // ml="0rem"
                pl="1rem"
                // pr="0.4rem"
                bgColor="primary.900"
                borderRadius="4px"
                align={props.align}
                w="auto"
                display={props.title ? 'inline-block' : 'none'}
                pt={props.hpt || "1rem"}
                pb={props.hpb || "1rem"}
                fontSize={props.hfontSize || "2xl"}
                fontWeight={props.hfontWeight || "700"}
                color={props.hcolor || "primary.100"}>
                {props.title}
            </Text>
            <VStack
                // as='fieldset'
                pl={props.pl || ['1rem', '2rem', "3rem"]}
                pr={props.pr || ['1rem', '2rem', "3rem"]}
                pt={props.pt || "1rem"}
                pb={props.pb || "1rem"}
                // divider={<StackDivider borderColor='primary.700' ml="-3rem" mr="-3rem" mt="2rem" mb="`2rem" />}
                // border={`1px solid #000`}
                // borderColor="#171c26"
                spacing={props.spacing || "2rem"}
                color={props.color}
                borderRadius={props.borderRadius || "2rem"}
                fontWeight={props.fontWeight || 800}
                bgColor={props.bgColor}
            // boxShadow={`inset 0 1px 2px 0 rgb(255 255 255 / 7%), inset 0 2px 2px 0 rgb(0 0 0 / 15%), inset 0 0 3px 5px rgb(0 0 0 / 2%), 2px 2px 4px 0 rgb(0 0 0 / 12%)`}
            >



                {props.children}
                {
                    props.helpText &&
                    <FormHelperText>
                        {props.helpText}
                    </FormHelperText>
                }



            </VStack >
        </VStack >
    )

}

export default FSGGroup;