//	ErrorAlert.tsx
interface ErrorAlertProps { message: string | null; }


export default function ErrorAlert({ message }: ErrorAlertProps): JSX.Element | null {
    if (!message) return null;
    return <div className="alert	alert-danger	my-4" role="alert">⚠	{message}</div>;
}