import React, { useState } from 'react';
import { createAuthor } from '../../services/api';
import { Input, Button, Spin, notification, Form } from 'antd';
import { useNavigate } from 'react-router-dom';

const CreateAuthor = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await createAuthor({ name });

            notification.success({
                message: 'Author Created Successfully',
                description: `The author "${name}" was created successfully.`,
            });

            navigate('/author');
        } catch (error) {
            const errorDetails = error?.response?.data?.errors || {};

            if (Object.keys(errorDetails).length > 0) {
                setErrors(errorDetails);
            } else {
                notification.error({
                    message: 'Error Creating Author',
                    description: error?.response?.data?.message || 'An unexpected error occurred.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Create New Author</h2>
            <Spin spinning={loading}>
                <Form layout="vertical" onSubmitCapture={handleSubmit}>
                    <Form.Item label="Name" required>
                        <Input
                            type="text"
                            placeholder="Enter author name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Create Author
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>

            <Button onClick={() => navigate('/author')} style={{ marginTop: '20px' }}>
                Back to Authors
            </Button>
        </div>
    );
};

export default CreateAuthor;
