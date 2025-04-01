import React from 'react';

interface EditInstallmentProps {
  row: any;
  onEdit: (id: number, formData: any) => void;
}

export default function EditInstallment({ row, onEdit }: EditInstallmentProps) {
  // Component logic here
  const [formData, setFormData] = React.useState({
    dueAmount: row.due_amount,
    status: row.status,
  });

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
    }));
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(row.id as number, formData);
};

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="dueAmount"
        value={formData.dueAmount}
        onChange={handleInputChange}
        placeholder="Due Amount"
      />
      <select name="status" value={formData.status} onChange={handleInputChange}>
        <option value="">Select Status</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
        <option value="contra">Contra</option>
        <option value="void">Void</option>
        <option value="late">Late</option>
      </select>
      <button type="submit">Save Changes</button>
    </form>
  );
}