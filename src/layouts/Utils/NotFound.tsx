import '../../Css/NotFound.css';

export const NotFound = () => {
    return (
        <div className='not-found d-flex flex-column justify-content-center align-items-center vh-100 text-center'>
            <h1 className='display-1'>404</h1>
            <h2>Page Not Found</h2>
            <p>Sorry, the page you are looking for does not exist.</p>
        </div>
    );
}