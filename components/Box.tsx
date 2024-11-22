import { twMerge } from "tailwind-merge";
interface Boxprops {
    children: React.ReactNode;
    className?: string;

}
import { Children } from "react";


const Box: React.FC<Boxprops> = ({
    children,
    className 
    
}) => {
    return (
          <div
          className={twMerge(`
               bg-orange-900  
               rounded-lg
               h-fit
               w-full

            `,
            className 
        )}
        
        >
            {children}
        </div>

    );


}
export default Box;