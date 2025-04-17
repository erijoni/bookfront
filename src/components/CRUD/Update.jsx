import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Select, Spin, notification } from 'antd';
import { fetchBookById, updateBook, fetchAllAuthors } from '../../services/api';

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const loadAuthors = async () => {
            try {
                const data = await fetchAllAuthors();
                setAuthors(data);
            } catch (error) {
                notification.error({
                    message: 'Error fetching authors',
                    description: 'There was an error while fetching authors.',
                });
            }
        };

        const loadBookData = async () => {
            setLoading(true);
            try {
                const response = await fetchBookById(id);

                const transformedData = {
                    ...response.data,
                    author_id: response.data.author.id,
                };

                form.setFieldsValue(transformedData);
            } catch (error) {
                notification.error({
                    message: 'Error fetching book data',
                    description: 'There was an error fetching the book data.',
                });
            } finally {
                setLoading(false);
            }
        };

        loadAuthors();
        loadBookData();
    }, [id, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await updateBook(id, values);
            message.success('Book updated successfully');
            navigate(`/books/${id}`);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'There was an error while updating the book.';
            notification.error({
                message: 'Error Updating Book',
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spin size="large" tip="Loading..." />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Edit Book</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter the book title' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="ISBN"
                    name="isbn"
                    rules={[{ required: true, message: 'Please enter the ISBN' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Author"
                    name="author_id"
                    rules={[{ required: true, message: 'Please select an author' }]}
                >
                    <Select placeholder="Select Author">
                        {authors.map((author) => (
                            <Select.Option key={author.id} value={author.id}>
                                {author.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update Book
                    </Button>
                </Form.Item>
            </Form>
            <Button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                Back to Home
            </Button>
        </div>
    );
};

export default Update;
