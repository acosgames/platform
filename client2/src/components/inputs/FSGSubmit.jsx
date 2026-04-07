import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";


function FSGSubmit(props) {

    let [loading, setLoading] = useState(false);

    let title = props.title || 'Save';
    if (loading) {
        title = props.loadingTitle || 'Saving';
    }

    var mounted = true;

    useEffect(() => {
        mounted = true;
        return () => {
            mounted = false;
        }
    }, []);

    return (
        <Box className="form-row">
            <Button
                disabled={loading}
                fontWeight={props.fontWeight}
                fontSize={props.fontSize}
                height={props.height}
                width={props.width}
                px={props.px}
                py={props.py}
                borderRadius={props.borderRadius || '0'}
                border={props.border}
                borderColor={props.borderColor}
                boxShadow={props.boxShadow}
                className="submit"
                color={props.color}
                bgColor={props.bgColor}
                transform={props.transform}
                _hover={props._hover}
                _focus={props._focus}
                _active={props._active}
                onClick={async (e) => {
                    setLoading(true);
                    try {
                        await props.onClick(e)
                    }
                    catch (err) {
                        console.error(err);
                        return;
                    }

                    if (mounted)
                        setLoading(false);
                }}>
                {title}
            </Button>
        </Box>
    )
}

export default FSGSubmit;