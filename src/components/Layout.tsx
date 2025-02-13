type LayoutProps = {
    children: React.ReactElement | React.ReactElement[]
}



function Layout({ children }: LayoutProps) {
    return (
        <>
            {children}
            <footer className="container-fluid my-3"><br />
                <p>&copy; Govind Pimpale, MIT Licensed</p>
            </footer>
        </>
    );
}


export default Layout;