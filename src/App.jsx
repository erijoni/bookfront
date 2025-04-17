import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Loading from './components/shared/Loading';
import ScrollToTop from './components/shared/ScrollToTop';
import './App.scss'
import Create from './components/CRUD/Create';
import Show from './components/CRUD/Show';
import Update from './components/CRUD/Update';
import Author from './components/Author/Author';
import CreateAuthor from './components/Author/CreateAuthor';
import EditAuthor from './components/Author/EditAuthor';
const App = () => {
  return (
    <>
      <Router>
        <Suspense fallback={<Loading />}>
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <Home />
              }
            />
            <Route
              path="/create"
              element={
                <Create />
              }
            />
            <Route
              path="/create-author"
              element={
                <CreateAuthor />
              }
            />
            <Route
              path="/author"
              element={
                <Author />
              }
            />
            <Route path="/books/:id" element={<Show />} />
            <Route path="/update/:id" element={<Update />} />
            <Route path="/author/:id" element={<EditAuthor />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
};

export default App;
