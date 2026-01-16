import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface Workspace {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
}

interface WorkspaceDialogProps {
  open: boolean;
  workspace: Workspace | null;
  formData: { name: string; description: string };
  onClose: () => void;
  onFormDataChange: (formData: { name: string; description: string }) => void;
  onSave: () => void;
}

const WorkspaceDialog: React.FC<WorkspaceDialogProps> = ({
  open,
  workspace,
  formData,
  onClose,
  onFormDataChange,
  onSave,
}) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormDataChange({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {workspace ? t('workspace.dialog.edit') : t('workspace.dialog.create')}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label={t('workspace.dialog.name')}
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label={t('workspace.dialog.description')}
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="contained">
            {workspace ? t('common.save') : t('common.add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WorkspaceDialog;