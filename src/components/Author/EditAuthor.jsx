import React, { useEffect, useState } from 'react';
import { Input, Button, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { updateAuthor, fetchAuthor } from '../../services/api';

const EditAuthor = () => {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAuthor(id);
                setAuthor(response);
                setName(response.data?.name);
            } catch (error) {
                notification.error({
                    message: 'Error',
                    description: 'Failed to load author details.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        if (!name) {
            notification.error({
                message: 'Validation Error',
                description: 'Name is required.',
            });
            return;
        }

        try {
            const response = await updateAuthor(id, { name });
            notification.success({
                message: 'Success',
                description: 'Author updated successfully.',
            });
            navigate('/author');
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to update author.',
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!author) {
        return <div>Author not found</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Edit Author</h2>
            <div>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Author Name"
                />
            </div>
            <Button
                type="primary"
                onClick={handleSubmit}
                style={{ marginTop: '10px' }}
            >
                Update Author
            </Button>
            <Button onClick={() => navigate('/author')} style={{ marginTop: '20px' }}>
                Back to Home
            </Button>
        </div>
    );
};

export default EditAuthor;
