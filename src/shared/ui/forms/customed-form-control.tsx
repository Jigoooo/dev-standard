import {
  useState,
  Children,
  ReactNode,
  isValidElement,
  cloneElement,
  ReactElement,
  ChangeEvent,
} from 'react';
import Box from '@mui/joy/Box';
import FormControl, { FormControlProps } from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { FormHelperText } from '@mui/joy';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { keyframes } from '@emotion/react';

import { isNullOrUndefined } from '@/shared/lib';

interface CustomedFormControlTypes extends FormControlProps {
  label?: string;
  labelColor?: string;
  errorMessage?: string;
  children: ReactNode;
  isLabelHorizontal?: boolean;
  labelGap?: number;
  isExternalTouched?: boolean;
}

export function CustomedFormControl({
  label,
  labelColor = '#777777',
  errorMessage,
  isLabelHorizontal = false,
  labelGap = 0.7,
  isExternalTouched = false,
  children,
  ...props
}: Readonly<CustomedFormControlTypes>) {
  const [touched, setTouched] = useState(false);

  const clonedChildren = Children.map(children, (child: ReactNode) => {
    if (isValidElement(child)) {
      const castedChild = child as ReactElement<{
        error?: boolean;
        onBlur?: () => void;
        onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
      }>;

      return cloneElement(castedChild, {
        error: (isExternalTouched || touched) && props?.error ? props.error : undefined,
        onBlur: () => setTouched(true),
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          setTouched(true);
          if (castedChild.props.onChange) {
            castedChild.props.onChange(event);
          }
        },
      });
    }
    return child;
  });

  const slideAnimation = keyframes`
    0% {
      transform: translateY(-10px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  `;

  return (
    <FormControl {...props} error={(isExternalTouched || touched) && props.error}>
      {isLabelHorizontal ? (
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          {label !== undefined && label !== null && (
            <FormLabel sx={{ mr: 1.5, mt: 0.8, color: labelColor, fontFamily: 'Pretendard' }}>
              {label}
            </FormLabel>
          )}
          {clonedChildren}
        </Box>
      ) : (
        <>
          {label !== undefined && label !== null && (
            <FormLabel sx={{ color: labelColor, marginBottom: labelGap, fontFamily: 'Pretendard' }}>
              {label}
            </FormLabel>
          )}
          {clonedChildren}
        </>
      )}

      {!isNullOrUndefined(errorMessage) && (
        <Box sx={{ height: '15px' }}>
          {(isExternalTouched || touched) && props.error && (
            <FormHelperText
              key={errorMessage}
              sx={{
                animation: `${slideAnimation} 0.3s ease-out forwards`,
              }}
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            >
              <ErrorOutlineOutlinedIcon />
              {errorMessage}
            </FormHelperText>
          )}
        </Box>
      )}
    </FormControl>
  );
}
