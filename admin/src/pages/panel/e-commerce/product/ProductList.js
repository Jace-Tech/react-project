import React, { useState, useEffect } from "react";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  BlockDes,
  Icon,
  Row,
  Col,
  Button,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  RSelect,
  PreviewAltCard,
  InputSwitch,
} from "../../../../components/Component";
import { DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Badge } from "reactstrap";
import { productData, categoryOptions } from "./ProductData";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import ProductH from "../../../../images/product/h.png";
import Dropzone from "react-dropzone";
import { Modal, ModalBody } from "reactstrap";
import { useSelector } from "react-redux";
import { getSubWords } from "../../../../utils/Utils";
import { handleAddProduct, handleUpdateProduct, uploadFile } from "../../../../apis/product";
import { toast } from "react-toastify";
import { toastStyle } from "../../../../utils/Constants";
import { useDispatch } from "react-redux";
import { addProducts } from "../../../../store/slice/contents";

const ProductList = () => {
  const products = useSelector(state => state.content.products)
  const categories = useSelector(state => state.content.categories)
  
  const [data, setData] = useState(products);
  const [sm, updateSm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    images: null,
    regularPrice: 0,
    salePrice: 0,
    category: [],
    description: "",
    isFeatured: false,
    check: false,
  });
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch()

  // POPULATE THE DATA WHEN THE PRODUCTS CHANGES
  useEffect(() => {
    setData(products)
  }, [products])


  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = products.filter((item) => {
        return item.name.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...products]);
    }
  }, [onSearchText]);

  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      images: null,
      regularPrice: 0,
      salePrice: 0,
      stock: 0,
      category: [],
      description: "",
      isFeatured: false,
      check: false,
    });
    reset({});
  };

  const handleConversion = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
  
      reader.addEventListener("load", async (e) => {
        const result = reader.result // e.target.result
        const res = await uploadFile({ image: result, name: file?.name })
        if(!res.success) reject(res.message)
        resolve(res.data.secure_url)
      })
    })
  }

  const onFormSubmit = async () => {
    const form = getValues()
    setIsLoading(true)

    const uploadedFiles = await Promise.all(files.map(file => handleConversion(file)))
    const data = {
      name: form.name,
      regularPrice: form.regularPrice,
      salePrice: form.salePrice,
      stock: form.stock,
      images: uploadedFiles,
      category: form.category.map(cat => cat.value),
      description: form.description,
      isFeatured: form.isFeatured.value
    }

    const result = await handleAddProduct(data)

    if(!result.success) {
      toast(result.message, {
        ...toastStyle,
        type: 'error'
      })
      setIsLoading(false)
      return
    }

    toast(result.message, {
      ...toastStyle,
      type: 'success'
    })

    // UPDATE THE PRODUCT STORE [REDUX]
    dispatch(addProducts([result.data, ...products ]))
    setIsLoading(false)

    // UPDATE / RESET UI STATES
    setView({ open: false });
    setFiles([]);
    resetForm();

    // ASSIGNMENT: Handle the delete functionality of the products
  };

  const onEditSubmit = async () => {
    const form = formData
    setIsLoading(true)
    let uploadedFiles = form.images

    if(files.length) {
      uploadedFiles = await Promise.all(files.map(file => handleConversion(file)))
    }

    const data = {
      name: form.name,
      regularPrice: form.regularPrice,
      salePrice: form.salePrice,
      stock: form.stock,
      images: uploadedFiles,
      category: form.category.map(cat => cat.value),
      description: form.description,
      isFeatured: form.isFeatured
    }

    const result = await handleUpdateProduct(editId, data)

    if(!result.success) {
      toast(result.message, {
        ...toastStyle,
        type: 'error'
      })
      setIsLoading(false)
      return
    }

    toast(result.message, {
      ...toastStyle,
      type: 'success'
    })

    // UPDATE THE PRODUCT STORE [REDUX]

    const oldData = [...products]
    const index = oldData.findIndex(item => item._id === editId)
    oldData[index] = result.data

    dispatch(addProducts(oldData))
    setIsLoading(false)

    // UPDATE / RESET UI STATES
    setView({ open: false });
    setFiles([]);
    setEditedId(null);
    resetForm();
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item._id === id) {
        setFormData({
          name: item.name,
          images: item.images,
          regularPrice: item.regularPrice,
          salePrice: item.salePrice,
          category: item.category?.map(category => ({value: category._id, label: category.name})),
          stock: item.stock,
          description: item.description,
          isFeatured: item?.isFeatured,
          check: false,
        });
      }
    });
    setEditedId(id);
    setFiles([]);
    setView({ add: false, edit: true });
  };

  useEffect(() => {
    reset(formData)
  }, [formData]);

  // selects all the products
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // selects one product
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].check = e.currentTarget.checked;
    setData([...newData]);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to delete a product
  const deleteProduct = (id) => {
    let defaultData = data;
    defaultData = defaultData.filter((item) => item.id !== id);
    setData([...defaultData]);
  };

  // function to delete the seletected item
  const selectorDeleteProduct = () => {
    let newData;
    newData = data.filter((item) => item.check !== true);
    setData([...newData]);
  };

  // toggle function to view product details
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
  };

  // handles ondrop function of dropzone
  const handleDropChange = (acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      })
    );
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <React.Fragment>
      <Head title="Products"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Products</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand me-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon name="search"></Icon>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Quick search by SKU"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="transparent"
                          className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                        >
                          Status
                        </DropdownToggle>
                        <DropdownMenu end>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>New Items</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Featured</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Out of Stock</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="nk-block-tools-opt">
                      <Button
                        className="toggle btn-icon d-md-none"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                      </Button>
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                        <span>Add Product</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <div className="nk-tb-list is-separate is-medium mb-3">
            <DataTableHead className="nk-tb-item">
              <DataTableRow className="nk-tb-col-check">
                <div className="custom-control custom-control-sm custom-checkbox notext">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="uid_1"
                    onChange={(e) => selectorCheck(e)}
                  />
                  <label className="custom-control-label" htmlFor="uid_1"></label>
                </div>
              </DataTableRow>
              <DataTableRow size="sm">
                <span>Name</span>
              </DataTableRow>
              <DataTableRow>
                <span>Price</span>
              </DataTableRow>
              <DataTableRow>
                <span>Stock</span>
              </DataTableRow>
              <DataTableRow size="md">
                <span>Category</span>
              </DataTableRow>
              <DataTableRow size="md">
                <span>Description</span>
              </DataTableRow>
              <DataTableRow size="md">
                <Icon name="star-round" className="tb-asterisk"></Icon>
              </DataTableRow>
              <DataTableRow className="nk-tb-col-tools">
                <ul className="nk-tb-actions gx-1 my-n1">
                  <li className="me-n1">
                    <UncontrolledDropdown>
                      <DropdownToggle
                        tag="a"
                        href="#toggle"
                        onClick={(ev) => ev.preventDefault()}
                        className="dropdown-toggle btn btn-icon btn-trigger"
                      >
                        <Icon name="more-h"></Icon>
                      </DropdownToggle>
                      <DropdownMenu end>
                        <ul className="link-list-opt no-bdr">
                          <li>
                            <DropdownItem tag="a" href="#edit" onClick={(ev) => ev.preventDefault()}>
                              <Icon name="edit"></Icon>
                              <span>Edit Selected</span>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem
                              tag="a"
                              href="#remove"
                              onClick={(ev) => {
                                ev.preventDefault();
                                selectorDeleteProduct();
                              }}
                            >
                              <Icon name="trash"></Icon>
                              <span>Remove Selected</span>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem tag="a" href="#stock" onClick={(ev) => ev.preventDefault()}>
                              <Icon name="bar-c"></Icon>
                              <span>Update Stock</span>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem tag="a" href="#price" onClick={(ev) => ev.preventDefault()}>
                              <Icon name="invest"></Icon>
                              <span>Update Price</span>
                            </DropdownItem>
                          </li>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </li>
                </ul>
              </DataTableRow>
            </DataTableHead>
            {currentItems.length > 0
              ? currentItems?.map((item) => {
                const categoryList = []
                  item.category?.forEach((currentElement) => { 
                  categoryList.push(currentElement.label)
                 })
                  return (
                    <DataTableItem key={item.id}>
                      <DataTableRow className="nk-tb-col-check">
                        <div className="custom-control custom-control-sm custom-checkbox notext">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            defaultChecked={item.check}
                            id={item.id + "uid1"}
                            key={Math.random()}
                            onChange={(e) => onSelectChange(e, item.id)}
                          />
                          <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                        </div>
                      </DataTableRow>
                      <DataTableRow size="sm">
                        <span className="tb-product">
                          <img src={item.images ? item?.images[0] : ProductH} alt="product" className="thumb" />
                          <span className="title">{item?.name}</span>
                        </span>
                      </DataTableRow>
                      <DataTableRow>
                        <span className="tb-sub">$ {item?.regularPrice}</span>
                      </DataTableRow>
                      <DataTableRow>
                        <span className="tb-sub">{item?.stock}</span>
                      </DataTableRow>

                      <DataTableRow size="md">
                          <span className="tb-sub">
                            {item.category?.map(cat => cat.name).join(", ")}
                          </span>
                      </DataTableRow>
                      
                      <DataTableRow size="md">
                          <span className="tb-sub">
                            {getSubWords(item?.description)}
                          </span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <div className="asterisk tb-asterisk">
                          <a
                            href="#asterisk"
                            className={item?.isFeatured ? "active" : ""}
                            onClick={(ev) => ev.preventDefault()}
                          >
                            <Icon name="star" className="asterisk-off"></Icon>
                            <Icon name="star-fill" className="asterisk-on"></Icon>
                          </a>
                        </div>
                      </DataTableRow>
                      <DataTableRow className="nk-tb-col-tools">
                        <ul className="nk-tb-actions gx-1 my-n1">
                          <li className="me-n1">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                tag="a"
                                href="#more"
                                onClick={(ev) => ev.preventDefault()}
                                className="dropdown-toggle btn btn-icon btn-trigger"
                              >
                                <Icon name="more-h"></Icon>
                              </DropdownToggle>
                              <DropdownMenu end>
                                <ul className="link-list-opt no-bdr">
                                  <li>
                                    <DropdownItem
                                      tag="a"
                                      href="#edit"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        onEditClick(item._id);
                                        toggle("edit");
                                      }}
                                    >
                                      <Icon name="edit"></Icon>
                                      <span>Edit Product</span>
                                    </DropdownItem>
                                  </li>
                                  <li>
                                    <DropdownItem
                                      tag="a"
                                      href="#view"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        onEditClick(item.id);
                                        toggle("details");
                                      }}
                                    >
                                      <Icon name="eye"></Icon>
                                      <span>View Product</span>
                                    </DropdownItem>
                                  </li>
                                  <li>
                                    <DropdownItem
                                      tag="a"
                                      href="#remove"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        deleteProduct(item.id);
                                      }}
                                    >
                                      <Icon name="trash"></Icon>
                                      <span>Remove Product</span>
                                    </DropdownItem>
                                  </li>
                                </ul>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </li>
                        </ul>
                      </DataTableRow>
                    </DataTableItem>
                  );
                })
              : null}
          </div>
          <PreviewAltCard>
            {data.length > 0 ? (
              <PaginationComponent
                itemPerPage={itemPerPage}
                totalItems={data.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            ) : (
              <div className="text-center">
                <span className="text-silent">No products found</span>
              </div>
            )}
          </PreviewAltCard>
        </Block>

        <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update Product</h5>
              <div className="mt-4">
                <form onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    <Col size="12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product-title">
                          Product Title
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            {...register('name', {
                              required: "This field is required",
                            })}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                          {errors.name && <span className="invalid">{errors.name.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="regular-price">
                          Regular Price
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            {...register('regularPrice', { required: "This is required" })}
                            className="form-control"
                            value={formData.regularPrice}
                            onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}/>
                          {errors.regularPrice && <span className="invalid">{errors.regularPrice.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="sale-price">
                          Sale Price
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className="form-control"
                            {...register('salePrice')}
                            value={formData.salePrice} 
                            onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}/>
                          {errors.salePrice && <span className="invalid">{errors.salePrice.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="stock">
                          Stock
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="number"
                            className="form-control"
                            {...register('stock', { required: "This is required" })}
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                          {errors.stock && <span className="invalid">{errors.stock.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="category">
                          Category
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                            isMulti
                            // options={categories.map((category) => {
                            //   const item = {
                            //     value: category._id,
                            //     label: category.name
                            //   }
                            //   return item
                            // })}
                            options={categories.map((category) => ({ value: category._id, label: category.name }))}
                            value={formData.category}
                            onChange={(value) => {
                              console.log("FORM DATA:", formData)
                              setFormData({ ...formData, category: value })
                            }}
                          //ref={register({ required: "This is required" })}
                          />
                          {errors.category && <span className="invalid">{errors.category.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="12">
                    <div className="form-group">
                        <label className="form-label" htmlFor="description">
                          Description
                        </label>
                        <div className="form-control-wrap">
                          <textarea
                            rows={5}
                            className="form-control"
                            {...register('description', { required: "This is required" })}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                          {errors.description && <span className="invalid">{errors.description.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="category">
                          Product Image
                        </label>
                        <div className="form-control-wrap">
                          { formData.images?.map(img => <img src={img} alt="" />) }
                        </div>
                      </div>
                    </Col>
                    <Col size="6">
                      <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div
                              {...getRootProps()}
                              className="dropzone upload-zone small bg-lighter my-2 dz-clickable"
                            >
                              <input {...getInputProps()} />
                              {files.length === 0 && <p>Drag 'n' drop some files here, or click to select files</p>}
                              {files.map((file) => (
                                <div
                                  key={file.name}
                                  className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                                >
                                  <div className="dz-image">
                                    <img src={file.preview} alt="preview" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </Col>

                    <Col size="12">
                      <Button color="primary" type="submit">
                        <Icon className="plus"></Icon>
                        <span>Update Product</span>
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">
                Product <small className="text-primary">#{formData.sku}</small>
              </h4>
              <img src={formData.img} alt="" />
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Product Name</span>
                  <span className="caption-text">{formData.name}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Price</span>
                  <span className="caption-text">$ {formData.price}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Category</span>
                  <span className="caption-text">
                    {formData.category.map((item, index) => (
                      <Badge key={index} className="me-1" color="secondary">
                        {item.value}
                      </Badge>
                    ))}
                  </span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Stock</span>
                  <span className="caption-text"> {formData.stock}</span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>

        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${
            view.add ? "content-active" : ""
          }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Add Product</BlockTitle>
              <BlockDes>
                <p>Add information or update product.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="product-title">
                      Product Title
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        {...register('name', {
                          required: "This field is required",
                        })}
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      Regular Price
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        {...register('regularPrice', { required: "This is required" })}
                        className="form-control"
                        value={formData.regularPrice} 
                        onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}/>
                      {errors.regularPrice && <span className="invalid">{errors.regularPrice.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="sale-price">
                      Sale Price
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        className="form-control"
                        {...register('salePrice')}
                        value={formData.salePrice} 
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}/>
                      {errors.salePrice && <span className="invalid">{errors.salePrice.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="stock">
                      Stock
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        className="form-control"
                        {...register('stock', { required: "This is required" })}
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                      {errors.stock && <span className="invalid">{errors.stock.message}</span>}
                    </div>
                  </div>
                </Col>

                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="isFeatured">
                      Featured
                    </label>
                    <div className="form-control-wrap">
                      <RSelect
                        name="isFeatured"
                        options={[ {value: true, label: "Yes"}, {value: false, label: "No" } ]}
                        onChange={(value) => setFormData({ ...formData, isFeatured: value })}
                        value={formData.isFeatured}
                        //ref={register({ required: "This is required" })}
                      />
                      {errors.isFeatured && <span className="invalid">{errors.isFeatured.message}</span>}
                    </div>
                  </div>
                </Col>
                
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="category">
                      Category
                    </label>
                    <div className="form-control-wrap">
                      <RSelect
                        name="category"
                        isMulti
                        options={categories.map(category => ({ value: category._id, label: category.name }))}
                        onChange={(value) => setFormData({ ...formData, category: value })}
                        value={formData.category}
                        //ref={register({ required: "This is required" })}
                      />
                      {errors.category && <span className="invalid">{errors.category.message}</span>}
                    </div>
                  </div>
                </Col>

                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="Description">
                      Description
                    </label>
                    <div className="form-control-wrap">
                      <textarea
                        row="5"
                        className="form-control"
                        {...register('description', { required: "This is required" })}
                        value={formData.description} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                      {errors.description && <span className="invalid">{errors.description.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <Dropzone multiple onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()} className="dropzone upload-zone small bg-lighter my-2 dz-clickable">
                          <input {...getInputProps()} />
                          {files.length === 0 && <p>Drag 'n' drop some files here, or click to select files</p>}
                          {files.map((file) => (
                            <div
                              key={file.name}
                              className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                            >
                              <div className="dz-image">
                                <img src={file.preview} alt="preview" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </Col>

                <Col size="12">
                  <Button color="primary" onClick={onFormSubmit}>
                    <Icon className="plus"></Icon>
                    <span>Add Product</span>
                  </Button>
                </Col>
              </Row>
            </form>
          </Block>
        </SimpleBar>

        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

export default ProductList;
