import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm, Controller } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
    resolver: zodResolver(createDepositSchema),
    mode: 'onChange', // better UX
  });
  const isAPILoading = useAgentStore(
    (state) => state.createDepositLoadingStatus,
  );
  const createDeposit = useAgentStore((state) => state.createDeposit);
  const handleClose = () => {
    onClose();
  };
  const onSubmit = async (data: CreateDepositFormValues) => {
    console.log(data);
    await createDeposit(data, Number(agentCode));
    onClose();
  };
  const isCreateDepositLoading = React.useMemo(
    () => isAPILoading === Status.Loading,
    [isAPILoading],
  );
  return (
    <React.Fragment>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Create Deposit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the deposit details for agent {agentCode}.
          </DialogContentText>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
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
    </React.Fragment>
  );
}
