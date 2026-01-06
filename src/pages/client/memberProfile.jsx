import { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function MemberProfilePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [member, setMember] = useState({});

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        if (user?.memberId) {
        if (user.memberId.length === 4) {
            searchCustomer(user.memberId);
        }
        }
    }, [user?.memberId]);

    const searchCustomer = async (id) => {
        if (!id || id === "0") return;

        setIsLoading(true);
        try {
        const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/member/${id}`
        );
        if (res.data) setMember(res.data);
        } catch (err) {
        toast.error(err.response?.data?.message || "Invalid Member ID");
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col space-y-6 overflow-hidden">
            <div className="bg-white shadow rounded-md max-h-[calc(100vh-150px)] space-y-8 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between bg-gray-50 shadow-lg rounded-xl p-6 space-y-4 border-l-6 border-green-700">
                    <div className="">
                        <h1 className="text-xl font-semibold text-gray-800">
                            ✏️ Member Profile
                        </h1>
                        <p className="text-sm text-gray-500">
                            Member details and information overview.
                        </p>
                    </div>
                    <div>
                        <Link
                            to="/"
                            className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow text-center"
                            >
                            Home
                        </Link>
                    </div>
                </div>


                {isLoading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : member && Object.keys(member).length > 0 ? (
                    //   <div className="bg-gray-50 shadow-lg rounded-xl p-6 space-y-4 border-l-6 border-blue-700">
                    <div className="bg-white w-full p-4 sm:p-8 shadow rounded-xl border border-gray-200">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                            {/* Left Column */}
                            <div className="flex flex-col gap-3 flex-1 space-y-4">
                                <div className="w-20">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Member Id
                                    </label>
                                    <div className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50">
                                        {member.memberId || "—"}
                                    </div>
                                </div>         

                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                    <div className="w-full sm:w-[12%]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Title
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50">
                                            {member.title || "—"}
                                        </div>
                                    </div>
                             
                                    <div className="w-full sm:flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50">
                                            {member.firstName || "—"}
                                        </div>
                                    </div>

                                    <div className="w-full sm:flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50">
                                            {member.lastName || "—"}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <div className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        {Array.isArray(member.address)
                                            ? member.address.join(", ")
                                            : member.address || "—"}
                                    </div>
                                </div>  

                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                    <div className="w-full sm:w-[20%]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50">
                                            {member.mobile || "—"}
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-[20%]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50">
                                            {member.phone || "—"}
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-[50%]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50">
                                            {member.email || "—"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                    <div className="w-full sm:w-[20%]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Period In School
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg">
                                            {member.periodInSchoolFrom || "—"}                                            
                                        </div>
                                    </div>		
                                    <div className="w-full sm:w-[20%]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Up To
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg">
                                            {member.periodInSchoolTo || "—"}                                            
                                        </div>

                                    </div>		
                                    <div className="w-full sm:w-[50%]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Invitee
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg">
                                            {member.invitedBy || "—"}                                            
                                        </div>
                                    </div>																		
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                    <div className="w-full sm:w-[45%]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Member Type
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 capitalize">
                                            {member.memberType || "Not Assigned"}
                                        </div>
                                    </div>    

                                    <div className="w-full sm:w-[50%]">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Member Role
                                        </label>
                                        <div className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 capitalize">
                                            {member.memberRole || "Not Assigned"}
                                        </div>
                                    </div>                                      
                                </div>  
                            </div>

                            {/* Right Column */}
                            <div className="flex flex-col gap-3 flex-1 space-y-4 md:mt-22">     
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                    </label>
                                    <textarea
                                        disabled={true}
                                        rows="6"
                                        value={member.notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Additional notes about the member..."
                                    ></textarea>
                                </div>

                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Member Images
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-300 p-2 rounded-lg shadow-inner">
                                        {member.image && member.image.length > 0 ? (
                                            member.image.map((imgUrl, index) => (
                                            <div key={index} className="rounded-md overflow-hidden">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Member image ${index + 1}`}
                                                    className="w-30 h-30 object-cover rounded-md"
                                                />
                                            </div>
                                            ))
                                        ) : (
                                            <p className="col-span-full text-sm text-gray-500 text-center">
                                                No images available.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                <p className="text-center text-blue-700">
                    Sorry, no member found.
                </p>
                )}
            </div>
        </div>
    );
}