import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  useForm,
  Controller,
  type SubmitHandler,
  type Resolver,
} from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  createDepositSchema,
  type CreateDepositFormValues,
} from '../utils/formSchemas';
import { Box } from '@mui/material';
import { useAgentStore } from '../store/AgentStore';
import { Status } from '../types/sharedEnums';

interface CreateDepositModalProps {
  // You can add props here if needed, such as a callback for when the deposit is created
  isOpen: boolean;
  onClose: () => void;
  agentCode: string; // Assuming you want to pass the agent code for which the deposit is being created
}

export default function CreateDepositModal({
  isOpen,
  onClose,
  agentCode,
}: CreateDepositModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateDepositFormValues>({
    resolver: zodResolver(
      createDepositSchema,
    ) as Resolver<CreateDepositFormValues>,
    mode: 'onChange', // better UX
  });
  const createDepositLoadingStatus = useAgentStore(
    (state) => state.createDepositLoadingStatus,
  );
  const createDeposit = useAgentStore((state) => state.createDeposit);
  const isCreateDepositLoading = createDepositLoadingStatus === Status.Loading;

  const onSubmit: SubmitHandler<CreateDepositFormValues> = async (data) => {
    await createDeposit(data, Number(agentCode));
    // Keep the modal open on failure so the user can see the error and retry.
    if (useAgentStore.getState().createDepositLoadingStatus === Status.Success) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Create Deposit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the deposit details for agent {agentCode}.
          </DialogContentText>
          <Box
            component='form'
            id='create-deposit-form'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
          >
              <Controller
                name='depositingAmount'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoFocus
                    required
                    margin='dense'
                    label='Depositing Amount'
                    type='number'
                    fullWidth
                    variant='outlined'
                    error={!!errors.depositingAmount}
                    helperText={errors.depositingAmount?.message}
                    inputProps={{ step: '0.01', min: '0' }}
                  />
                )}
              />

              <Controller
                name='voucherId'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    margin='dense'
                    label='Voucher ID'
                    type='text'
                    fullWidth
                    variant='outlined'
                    error={!!errors.voucherId}
                    helperText={errors.voucherId?.message}
                  />
                )}
              />

              <Controller
                name='dateRange.startDate'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box sx={{ mb: errors.dateRange?.startDate ? 1 : 0 }}>
                    <DatePicker
                      label='Start Date'
                      value={value ? dayjs(value) : null}
                      onChange={(date) => onChange(date?.toISOString() || null)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.dateRange?.startDate,
                          helperText: errors.dateRange?.startDate?.message,
                        },
                      }}
                    />
                  </Box>
                )}
              />

              <Controller
                name='dateRange.endDate'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box sx={{ mb: errors.dateRange?.endDate ? 1 : 0 }}>
                    <DatePicker
                      label='End Date'
                      value={value ? dayjs(value) : null}
                      onChange={(date) => onChange(date?.toISOString() || null)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.dateRange?.endDate,
                          helperText: errors.dateRange?.endDate?.message,
                        },
                      }}
                    />
                  </Box>
                )}
              />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            disabled={isCreateDepositLoading || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            form='create-deposit-form'
            variant='contained'
            disabled={isCreateDepositLoading || isSubmitting}
          >
            Create Deposit
          </Button>
        </DialogActions>
      </Dialog>
  );
}
