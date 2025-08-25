interface StatusCellProps {
  value: string;
}

export const StatusCell = ({ value }: StatusCellProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dispatched':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
        value
      )}`}
    >
      {value}
    </span>
  );
};
