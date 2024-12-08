import { twMerge } from "tailwind-merge";

interface BoxProps {
    children: React.ReactNode;
    className?: string;
}
const Box: React.FC<BoxProps> = ({ children, className }) => {
    return (
        <div className={twMerge(`inline-flex bg-gray-800 p-4 rounded-md`, className)}>
            {children}
        </div>
    )
};
export default Box;