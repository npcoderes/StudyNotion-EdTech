import axios from 'axios'
import { useState, useEffect } from 'react'
import { FaUserSlash, FaSort } from 'react-icons/fa'
import DataTable from './DataTable'
import { toast } from 'react-hot-toast'
import { FaStar } from 'react-icons/fa'
import { useSelector } from 'react-redux'


const InstructorAnalytics = () => {
    const [instructors, setInstructors] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortField, setSortField] = useState('rating')
    const [sortOrder, setSortOrder] = useState('desc')
    const { token } = useSelector(state => state.auth)
    const BASE_URL = process.env.REACT_APP_BASE_URL

    const fetchInstructors = async () => {
        try {
            setLoading(true);
    
            // Get all instructors
            const { data: instructors } = await axios.get(`${BASE_URL}/admin/instructors`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Get analytics for each instructor
            const instructorsWithAnalytics = await Promise.all(
                instructors.map(async (instructor) => {
                    try {
                        const { data: analyticsResponse } = await axios.get(
                            `${BASE_URL}/admin/instructor-analytics?id=${instructor._id}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        );
    
                        return {
                            ...instructor,
                            performance: analyticsResponse.data,
                        };
                    } catch (error) {
                        console.error(`Error fetching analytics for instructor ${instructor._id}:`, error.message);
    
                        return {
                            ...instructor,
                            performance: {
                                averageRating: 0,
                                averageSentiment: 0,
                                totalReviews: 0,
                                isPerformanceCritical: false,
                            },
                        };
                    }
                })
            );
    
            setInstructors(instructorsWithAnalytics);
        } catch (error) {
            console.error("Failed to fetch instructors:", error.message);
            toast.error("Failed to fetch instructors data");
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleDeactivate = async (instructorId) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/admin/deactivate-instructor`,
                { instructorId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            
            if (response.data.success) {
                toast.success('Instructor deactivated successfully')
                fetchInstructors()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to deactivate instructor')
        }
    }

    useEffect(() => {
        fetchInstructors()
    }, [])


    const columns = [
        {
            header: 'Instructor',
            accessor: 'firstName',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <img
                        src={row.image}
                        className="w-8 h-8 rounded-full"
                        alt={row.firstName}
                    />
                    <span>{`${row.firstName} ${row.lastName}`}</span>
                </div>
            )
        },
        {
            header: 'Rating',
            accessor: 'performance.averageRating',
            cell: (row) => (
                <div className="flex items-center gap-1">
                    <span>{row.performance.averageRating.toFixed(1)}</span>
                    <FaStar className="text-yellow-500" />
                </div>
            )
        },
        {
            header: 'Sentiment',
            accessor: 'performance.averageSentiment',
            cell: (row) => (
                <div className={`px-2 py-1 rounded ${row.performance.averageSentiment >= 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {row.performance.averageSentiment.toFixed(2)}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'performance.isPerformanceCritical',
            cell: (row) => (
                <div className={`px-2 py-1 rounded ${row.performance.isPerformanceCritical
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                    {row.performance.isPerformanceCritical ? 'Critical' : 'Good'}
                </div>
            )
        },
        {
            header: 'Actions',
            cell: (row) => (
                row.performance.isPerformanceCritical && (
                    <button
                        onClick={() => handleDeactivate(row._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                        <FaUserSlash className="inline mr-1" /> Deactivate
                    </button>
                )
            )
        }
    ]

    return (
        <div className="p-6 bg-richblack-900">
            <h1 className="text-3xl font-bold text-richblack-5 mb-8">
                Instructor Performance Analytics
            </h1>

            {loading ? (
                <div className="flex justify-center">Loading...</div>
            ) : (
                <DataTable
                    data={instructors}
                    columns={columns}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={(field, order) => {
                        setSortField(field)
                        setSortOrder(order)
                    }}
                />
            )}
        </div>
    )
}

export default InstructorAnalytics