export const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  export const formatDateShort = (dateString: string) => new Date(dateString)
  .toLocaleDateString('en-US', 
    { month: 'short', day: 'numeric', year: 'numeric' });
  export const getDaysUntilDeadline = (deadline: string) => Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
