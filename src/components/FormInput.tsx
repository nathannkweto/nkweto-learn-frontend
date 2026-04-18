import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

type FormInputProps = TextFieldProps & {
    errorMessage?: string;
    isValid?: boolean;
};

export default function FormInput({ errorMessage, isValid, ...props }: FormInputProps) {
    // If isValid is explicitly false, show error
    const showError = isValid === false;

    return (
        <TextField
            fullWidth
            margin="normal"
            error={showError}
            helperText={showError ? errorMessage : props.helperText}
            {...props}
        />
    );
}