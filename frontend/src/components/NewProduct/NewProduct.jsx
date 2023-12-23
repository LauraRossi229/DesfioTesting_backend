import React, { useState, useRef } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCookiesByName } from "../../utils/formUtils";

const NewProduct = () => {
  const [validated, setValidated] = useState(false);

  const newProductFormRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datForm = new FormData(newProductFormRef.current);
    const data = Object.fromEntries(datForm);
    const token = getCookiesByName("jwtCookie");
    console.log(token);
    const response = await fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status == 200) {
      const datos = await response.json();
      console.log(datos);
      navigate("/products");
    } else {
      const datos = await response.json();
      console.log(datos);
    }
  };



  return (
    <Container className="container-form mt-3">
      <h1 className="text-center m-3">Registrado</h1>
      <Form
        onSubmit={handleSubmit}
        className=""
        ref={newProductFormRef}
      >
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom01">
            <Form.Label>Titulo</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Titulo"
              name="title"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom02">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Descripción"
              name="description"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustomUsername">
            <Form.Label>Precio</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
              <Form.Control
                type="number"
                name="price"
                placeholder="Precio"
                aria-describedby="inputGroupPrepend"
                required
              />
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom03">
            <Form.Label>Codigo</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Codigo"
              name="code"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom04">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="Stock"
              name="stock"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom05">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Categoria"
              name="category"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
            <Button type="submit" className="mt-3 mb-3 w-100">
              Registrar
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default NewProduct;

/* clase 15 03:31:37 */