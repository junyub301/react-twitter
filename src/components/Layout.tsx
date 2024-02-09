import MenuList from "./Menu";

interface LayoutProps {
    children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
    return (
        <div className="layout">
            {children}
            <MenuList />
        </div>
    );
}
