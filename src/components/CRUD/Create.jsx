import React, { useState, useEffect } from 'react';
import { createBook, fetchAllAuthors } from '../../services/api';
import { Input, Button, Select, Spin, notification, Form } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Create = () => {
    const [title, setTitle] = useState('');
    const [isbn, setIsbn] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [coverImageError, setCoverImageError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const loadAuthors = async () => {
            try {
                const data = await fetchAllAuthors();
                setAuthors(data);
            } catch (error) {
                console.error('Failed to load authors', error);
            }
        };

        loadAuthors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newBook = { title, isbn, author_id: authorId };
        setLoading(true);
        setErrors({});
        setCoverImageError('');

        try {
            const createdBook = await createBook(newBook);
            setCoverImage(createdBook.cover_image);
            notification.success({
                message: 'Book Created Successfully',
                description: `The book titled "${title}" was created successfully.`,
            });
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'There was an error while creating the book.';
            const errorDetails = error?.response?.data?.errors || {};

            if (error?.response?.data?.message === 'Unable to fetch cover image for the book.') {
                setCoverImageError('Unable to fetch cover image for the book.');
            }

            if (errorDetails && Object.keys(errorDetails).length > 0) {
                setErrors(errorDetails);
            } else {
                notification.error({
                    message: 'Error Creating Book',
                    description: errorMessage,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Create New Book</h2>
            <Spin spinning={loading}>
                <Form layout="vertical" onSubmitCapture={handleSubmit}>
                    <Form.Item label="Title" required>
                        <Input
                            type="text"
                            placeholder="Enter book title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && <p style={{ color: 'red' }}>{errors.title[0]}</p>}
                    </Form.Item>

                    <Form.Item label="ISBN" required>
                        <Input
                            type="text"
                            placeholder="Enter ISBN"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                        />
                        {errors.isbn && <p style={{ color: 'red' }}>{errors.isbn[0]}</p>}
                    </Form.Item>

                    <Form.Item label="Author" required>
                        <Select
                            value={authorId}
                            onChange={(value) => setAuthorId(value)}
                            placeholder="Select Author"
                        >
                            {authors.length > 0 ? (
                                authors.map((author) => (
                                    <Option key={author.id} value={author.id}>
                                        {author.name}
                                    </Option>
                                ))
                            ) : (
                                <Option disabled>No authors available</Option>
                            )}
                        </Select>
                        {errors.author_id && <p style={{ color: 'red' }}>{errors.author_id[0]}</p>}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Create Book
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>

            {coverImageError && <p style={{ color: 'red' }}>{coverImageError}</p>}

            {coverImage && (
                <div>
                    <h3>Book Cover</h3>
                    <img src={coverImage} alt="Book Cover" width="100" />
                </div>
            )}

            <Button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                Back to Home
            </Button>
        </div>
    );
};

export default Create;
