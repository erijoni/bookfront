import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookById } from '../../services/api';
import { Card, Typography, Spin, Divider, Row, Col, Image, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const Show = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const loadBook = async () => {
            try {
                const data = await fetchBookById(id);
                setBook(data.data);
            } catch (error) {
                console.error('Error loading book:', error);
            } finally {
                setLoading(false);
            }
        };
        loadBook();
    }, [id]);

    if (loading || !book) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <Row justify="center" style={{ padding: '40px' }}>
                <Col xs={24} sm={20} md={16} lg={12}>
                    <Card bordered style={{ borderRadius: '16px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={10}>
                                <Image
                                    width="100%"
                                    src={book.cover_image}
                                    alt={book.title}
                                    style={{ borderRadius: '10px' }}
                                />
                            </Col>
                            <Col xs={24} md={14}>
                                <Title level={3}>{book.title || 'Untitled Book'}</Title>
                                <Divider />
                                <Paragraph>
                                    <Text strong>Author:</Text>{' '}
                                    {book.author?.name || 'Unknown Author'}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong>ISBN:</Text>{' '}
                                    {book.isbn || 'N/A'}
                                </Paragraph>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                Back to Home
            </Button>
        </>
    );
};

export default Show;
