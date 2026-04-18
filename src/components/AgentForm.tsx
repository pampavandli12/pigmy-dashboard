import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import Container from '@mui/material/Container';
import { useForm, Controller } from 'react-hook-form';
import { addAgentSchema, type AddAgentFormValues } from '../utils/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

type AgentFormProps = {
  defaultValues?: AddAgentFormValues | null;
  callback: (data: AddAgentFormValues) => void;
  isUpdate?: boolean;
};

function AddAgent({
  defaultValues = null,
  callback,
  isUpdate,
}: AgentFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddAgentFormValues>({
    resolver: zodResolver(addAgentSchema),
    mode: 'onChange', // better UX
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleCancel = () => {
    // Handle cancel action
    navigate(-1); // Go back to previous page
  };

  return (
    <Container
      maxWidth={false}
      sx={{ width: { xs: '100%', md: '70%' }, mx: 'auto', py: 6 }}
    >
      <Box sx={{ width: '100%' }}>
        {/* Back Link */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 3,
            cursor: 'pointer',
            color: '#666666',
            fontSize: '14px',
            fontWeight: 500,
            '&:hover': {
              color: '#333333',
            },
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            size='small'
            sx={{
              p: 0,
              mr: 1,
              color: '#666666',
              '&:hover': { backgroundColor: 'transparent', color: '#333333' },
            }}
            aria-label='back'
          >
            <ArrowBackIcon sx={{ fontSize: '20px' }} /> &nbsp;{' '}
            <Typography sx={{ fontSize: '14px' }}>
              Back to Agent Management
            </Typography>
          </IconButton>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
            Add New Agent
          </Typography>
          <Typography sx={{ color: '#666666', fontSize: '15px' }}>
            Fill in the details below to create a new agent account.
          </Typography>
        </Box>

        {/* Form Card */}
        <Paper
          elevation={1}
          sx={{
            padding: 4,
            borderRadius: '12px',
          }}
        >
          <Box
            component='form'
            onSubmit={handleSubmit(callback)}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {/* Name Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333333',
                  mb: 1,
                }}
              >
                Name
              </Typography>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    {...field}
                    name='name'
                    placeholder='e.g., John Doe'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    variant='outlined'
                    size='medium'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Phone Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333333',
                  mb: 1,
                }}
              >
                Phone
              </Typography>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    {...field}
                    name='phone'
                    type='number'
                    placeholder='Enter phone number'
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    variant='outlined'
                    size='medium'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* address Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333333',
                  mb: 1,
                }}
              >
                Address
              </Typography>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    {...field}
                    name='address'
                    placeholder='Enter Address'
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    variant='outlined'
                    size='medium'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333333',
                  mb: 1,
                }}
              >
                Password
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      name='password'
                      type='password'
                      placeholder='Enter Password'
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      variant='outlined'
                      size='medium'
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '6px',
                        },
                      }}
                    />
                  )}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#999999',
                  mt: 1,
                }}
              >
                A secure password will be automatically generated.
              </Typography>
            </Box>

            {/* Email Field */}

            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333333',
                  mb: 1,
                }}
              >
                Email
              </Typography>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    {...field}
                    name='email'
                    placeholder='Enter Email'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    variant='outlined'
                    size='medium'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Agent Code */}
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333333',
                  mb: 1,
                }}
              >
                Agent Code
              </Typography>
              <Controller
                name='agentCode'
                control={control}
                disabled={isUpdate} // Disable agent code input during update
                render={({ field }) => (
                  <TextField
                    fullWidth
                    {...field}
                    name='agentCode'
                    type='number'
                    placeholder='Enter Agent Code'
                    error={!!errors.agentCode}
                    helperText={errors.agentCode?.message}
                    variant='outlined'
                    size='medium'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                      },
                    }}
                  />
                )}
              />
            </Box>
            {/* Agent Type */}
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333333',
                  mb: 1,
                }}
              >
                Agent Type
              </Typography>

              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.type}>
                    <Select
                      {...field}
                      value={field.value || ''}
                      displayEmpty
                      readOnly={isUpdate} // Disable type selection during update
                      size='medium'
                      sx={{
                        borderRadius: '6px',
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <span style={{ color: '#9e9e9e' }}>
                              Select Type
                            </span>
                          );
                        }
                        return (
                          selected.charAt(0).toUpperCase() + selected.slice(1)
                        );
                      }}
                    >
                      <MenuItem value='' disabled>
                        Select Type
                      </MenuItem>

                      <MenuItem value='agent'>agent</MenuItem>
                      <MenuItem value='employee'>employee</MenuItem>
                    </Select>

                    <FormHelperText>{errors.type?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Box>
            {/* Limit Amount */}
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333333',
                  mb: 1,
                }}
              >
                Limit Amount
              </Typography>
              <Controller
                name='limitAmount'
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    {...field}
                    name='limitAmount'
                    placeholder='Enter Limit Amount'
                    error={!!errors.limitAmount}
                    helperText={errors.limitAmount?.message}
                    variant='outlined'
                    size='medium'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                      },
                    }}
                  />
                )}
              />
            </Box>
            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                mt: 2,
              }}
            >
              <Button
                variant='outlined'
                onClick={handleCancel}
                sx={{
                  color: '#333333',
                  borderColor: '#e0e0e0',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderColor: '#d0d0d0',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                type='submit'
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                Save
              </Button>
              {errors.root && (
                <Alert sx={{ marginBottom: 2 }} severity='warning'>
                  {errors.root.message}
                </Alert>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default AddAgent;
