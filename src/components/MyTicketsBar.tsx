// src/components/MyTicketsBar.tsx

const MyTicketsBar = () => {
    return (
        <div className="bg-gray-800 text-white py-2 text-center w-full rounded-md">
            <a href="/meus-numeros" className="font-semibold text-sm">
                <i className="bi bi-cart mr-2"></i> 
                Meus títulos
            </a>
        </div>
    );
}

export default MyTicketsBar;
