import React from 'react';

interface DeleteInstallmentProps {
  row: any;
  onDelete: (id: number) => void;
}

export default function DeleteInstallment({ row, onDelete }: DeleteInstallmentProps) {
  // Component logic here
  const handleDelete = () => {
    onDelete(row.id);
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
}