import React, { useEffect, useMemo, useState } from 'react';
import { assetUrl } from '../utils/assets';

const PHOTO_ACCEPT = 'image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.svg,.bmp,.tif,.tiff,.heic,.heif,.jfif,.pjpeg,.pjp';

const emptyForm = {
  sku: '', name: '', price: '', category: 'Eco Board', badge: 'New', stock: 'In stock', leadTime: '2-4 days', rating: '4.6', image: '', description: '', specs: '', gallery: ''
};

function formFromProduct(product) {
  if (!product) return emptyForm;
  return {
    sku: product.sku || '', name: product.name || '', price: product.price || '', category: product.category || 'Eco Board', badge: product.badge || '', stock: product.stock || '', leadTime: product.leadTime || '', rating: product.rating || '4.6', image: product.image || '', description: product.description || '', specs: (product.specs || []).join(', '), gallery: (product.gallery || []).join(', ')
  };
}

function heroFormFromSlide(slide) {
  return {
    eyebrow: slide?.eyebrow || '', title: slide?.title || '', text: slide?.text || '', image: slide?.image || '', cta: slide?.cta || 'Shop now', href: slide?.href || '/categories'
  };
}

function categoryFormFromCategory(category) {
  return {
    name: category?.name || '', tagline: category?.tagline || '', image: category?.image || '', color: category?.color || '#f97316'
  };
}

function specsFromText(value) {
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
}

function imageListFromProduct(product) {
  const images = [product?.image, ...specsFromText(product?.gallery)].filter(Boolean);
  return [...new Set(images)];
}

function imageName(value) {
  if (!value) return 'No image selected';
  return String(value).split('/').pop().split('?')[0] || value;
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('ramani_admin_key') || '');
  const [pendingKey, setPendingKey] = useState('');
  const [unlocked, setUnlocked] = useState(Boolean(sessionStorage.getItem('ramani_admin_key')));
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posterSpecs, setPosterSpecs] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [selectedHeroId, setSelectedHeroId] = useState('');
  const [heroForm, setHeroForm] = useState(heroFormFromSlide());
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categoryForm, setCategoryForm] = useState(categoryFormFromCategory());
  const [selectedId, setSelectedId] = useState('new');
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [heroMessage, setHeroMessage] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');
  const [categoryUploading, setCategoryUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(null);
  const [heroUploading, setHeroUploading] = useState(false);

  const adminHeaders = useMemo(() => ({ 'x-admin-key': adminKey }), [adminKey]);
  const selectedProduct = useMemo(() => products.find((product) => String(product.id) === String(selectedId)), [products, selectedId]);
  const selectedHero = useMemo(() => heroSlides.find((slide) => String(slide.id) === String(selectedHeroId)), [heroSlides, selectedHeroId]);
  const selectedCategory = useMemo(() => categories.find((category) => String(category.id) === String(selectedCategoryId)), [categories, selectedCategoryId]);
  const heroSpec = posterSpecs.find((spec) => spec.name === 'Homepage hero carousel') || posterSpecs[0];
  const categorySpec = posterSpecs.find((spec) => spec.name === 'Category carousel poster');
  const productSpec = posterSpecs.find((spec) => spec.name === 'Product card image');
  const previewProduct = selectedProduct ? { ...selectedProduct, ...form, price: Number(form.price || 0), specs: specsFromText(form.specs) } : { ...form, price: Number(form.price || 0), specs: specsFromText(form.specs) };
  const previewImages = imageListFromProduct(previewProduct);

  async function loadAdmin() {
    const [productRes, categoryRes, heroRes, specsRes] = await Promise.all([
      fetch('/api/admin/products', { headers: adminHeaders }),
      fetch('/api/admin/categories', { headers: adminHeaders }),
      fetch('/api/admin/hero-slides', { headers: adminHeaders }),
      fetch('/api/admin/poster-specs', { headers: adminHeaders })
    ]);
    if (productRes.status === 401 || heroRes.status === 401 || categoryRes.status === 401) {
      sessionStorage.removeItem('ramani_admin_key');
      setUnlocked(false);
      throw new Error('Admin access required.');
    }
    const productData = await productRes.json();
    const categoryData = await categoryRes.json();
    const heroData = await heroRes.json();
    const specsData = await specsRes.json();
    setProducts(productData || []);
    setCategories(categoryData || []);
    if (!selectedCategoryId && categoryData?.[0]) {
      setSelectedCategoryId(categoryData[0].id);
      setCategoryForm(categoryFormFromCategory(categoryData[0]));
    }
    setHeroSlides(heroData || []);
    setPosterSpecs(specsData || []);
    if (!selectedHeroId && heroData?.[0]) {
      setSelectedHeroId(heroData[0].id);
      setHeroForm(heroFormFromSlide(heroData[0]));
    }
  }

  useEffect(() => {
    if (!unlocked) return;
    loadAdmin().catch((error) => setMessage(error.message || 'Unable to load admin data right now.'));
  }, [unlocked, adminKey]);

  function unlockAdmin(event) {
    event.preventDefault();
    const key = pendingKey.trim();
    if (!key) return setMessage('Enter your admin access code.');
    sessionStorage.setItem('ramani_admin_key', key);
    setAdminKey(key);
    setUnlocked(true);
    setMessage('');
  }

  function lockAdmin() {
    sessionStorage.removeItem('ramani_admin_key');
    setAdminKey(''); setPendingKey(''); setUnlocked(false); setProducts([]); setHeroSlides([]); setMessage('');
  }

  function chooseHero(slide) {
    setSelectedHeroId(slide.id);
    setHeroForm(heroFormFromSlide(slide));
    setHeroMessage('');
  }

  function updateHeroField(field, value) {
    setHeroForm((current) => ({ ...current, [field]: value }));
  }

  async function saveHero(event) {
    event.preventDefault();
    if (!selectedHeroId) return;
    setSaving(true);
    setHeroMessage('Saving hero carousel slide...');
    try {
      const response = await fetch(`/api/admin/hero-slides/${selectedHeroId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...adminHeaders }, body: JSON.stringify(heroForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Hero slide save failed.');
      setHeroSlides(data.heroSlides || []);
      setHeroForm(heroFormFromSlide(data.slide));
      setHeroMessage('Hero carousel slide updated.');
    } catch (error) {
      setHeroMessage(error.message || 'Could not save hero slide.');
    } finally {
      setSaving(false);
    }
  }

  async function uploadHeroImage(event) {
    event.preventDefault();
    const file = event.target.image.files[0];
    if (!selectedHeroId || !file) return setHeroMessage('Choose a hero slide and image first.');
    setHeroUploading(true);
    setHeroMessage('Uploading hero carousel picture...');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(`/api/admin/hero-slides/${selectedHeroId}/image`, { method: 'POST', headers: adminHeaders, body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed.');
      setHeroSlides(data.heroSlides || []);
      setHeroForm(heroFormFromSlide(data.slide));
      event.target.reset();
      setHeroMessage('Hero carousel picture updated.');
    } catch (error) {
      setHeroMessage(error.message || 'Hero picture upload failed.');
    } finally {
      setHeroUploading(false);
    }
  }


  function chooseCategory(category) {
    setSelectedCategoryId(category.id);
    setCategoryForm(categoryFormFromCategory(category));
    setCategoryMessage('');
  }

  function updateCategoryField(field, value) {
    setCategoryForm((current) => ({ ...current, [field]: value }));
  }

  async function saveCategory(event) {
    event.preventDefault();
    if (!selectedCategoryId) return;
    setSaving(true);
    setCategoryMessage('Saving featured collection slide...');
    try {
      const response = await fetch(`/api/admin/categories/${selectedCategoryId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...adminHeaders }, body: JSON.stringify(categoryForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Featured collection save failed.');
      setCategories(data.categories || []);
      setCategoryForm(categoryFormFromCategory(data.category));
      setCategoryMessage('Featured collection slide updated.');
    } catch (error) {
      setCategoryMessage(error.message || 'Could not save featured collection.');
    } finally {
      setSaving(false);
    }
  }

  async function uploadCategoryImage(event) {
    event.preventDefault();
    const file = event.target.image.files[0];
    if (!selectedCategoryId || !file) return setCategoryMessage('Choose a featured collection and image first.');
    setCategoryUploading(true);
    setCategoryMessage('Uploading featured collection poster...');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(`/api/admin/categories/${selectedCategoryId}/image`, { method: 'POST', headers: adminHeaders, body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed.');
      setCategories(data.categories || []);
      setCategoryForm(categoryFormFromCategory(data.category));
      event.target.reset();
      setCategoryMessage('Featured collection poster updated.');
    } catch (error) {
      setCategoryMessage(error.message || 'Featured collection poster upload failed.');
    } finally {
      setCategoryUploading(false);
    }
  }
  function chooseProduct(id) {
    setSelectedId(id); setMessage(''); setForm(id === 'new' ? emptyForm : formFromProduct(products.find((product) => String(product.id) === String(id))));
  }
  function updateField(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  async function saveProduct(event) {
    event.preventDefault(); setSaving(true); setMessage(selectedId === 'new' ? 'Adding product...' : 'Saving product...');
    try {
      const endpoint = selectedId === 'new' ? '/api/admin/products' : `/api/admin/products/${selectedId}`;
      const method = selectedId === 'new' ? 'POST' : 'PUT';
      const response = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json', ...adminHeaders }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Save failed.');
      setProducts(data.products || []); setSelectedId(String(data.product.id)); setForm(formFromProduct(data.product)); setMessage(selectedId === 'new' ? 'Product added.' : 'Product updated.');
    } catch (error) { setMessage(error.message || 'Could not save product.'); } finally { setSaving(false); }
  }

  async function uploadImage(event) {
    event.preventDefault();
    const file = event.target.image.files[0];
    if (selectedId === 'new') return setMessage('Save the product before uploading a picture.');
    if (!file) return setMessage('Choose an image file first.');
    setUploading(true); setMessage('Uploading main product picture...');
    try {
      const formData = new FormData(); formData.append('image', file);
      const response = await fetch(`/api/admin/products/${selectedId}/image`, { method: 'POST', headers: adminHeaders, body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed.');
      setProducts(data.products || []); setForm(formFromProduct(data.product)); setMessage('Main product picture replaced.'); event.target.reset();
    } catch (error) { setMessage(error.message || 'Picture upload failed.'); } finally { setUploading(false); }
  }

  async function uploadGalleryImage(event, index) {
    event.preventDefault();
    const file = event.target.image.files[0];
    if (selectedId === 'new') return setMessage('Save the product before replacing gallery photos.');
    if (!file) return setMessage('Choose an image file first.');
    setGalleryUploading(index); setMessage(`Replacing gallery photo ${index + 1}...`);
    try {
      const formData = new FormData(); formData.append('image', file);
      const response = await fetch(`/api/admin/products/${selectedId}/gallery/${index}/image`, { method: 'POST', headers: adminHeaders, body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gallery upload failed.');
      setProducts(data.products || []); setForm(formFromProduct(data.product)); setMessage(`Gallery photo ${index + 1} replaced.`); event.target.reset();
    } catch (error) { setMessage(error.message || 'Gallery picture upload failed.'); } finally { setGalleryUploading(null); }
  }

  async function deleteProduct() {
    if (selectedId === 'new') return;
    if (!window.confirm('Delete this product from the catalog?')) return;
    setSaving(true); setMessage('Deleting product...');
    try {
      const response = await fetch(`/api/admin/products/${selectedId}`, { method: 'DELETE', headers: adminHeaders });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Delete failed.');
      setProducts(data.products || []); setSelectedId('new'); setForm(emptyForm); setMessage('Product deleted.');
    } catch (error) { setMessage(error.message || 'Could not delete product.'); } finally { setSaving(false); }
  }

  if (!unlocked) {
    return (
      <main><section className="private-admin-shell"><form className="private-admin-card" onSubmit={unlockAdmin}>
        <span className="eyebrow">Private</span><h1>Admin access</h1><p>This catalog manager is hidden from the public storefront and requires your private access code.</p>
        <label>Access code<input type="password" value={pendingKey} onChange={(event) => setPendingKey(event.target.value)} autoFocus /></label>
        <button className="button primary" type="submit">Unlock admin</button>{message ? <p className="status-text">{message}</p> : null}
      </form></section></main>
    );
  }

  return (
    <main>
      <section className="page-hero compact admin-hero"><div className="container">
        <span className="eyebrow">Private Admin</span><h1>Manage storefront content.</h1><p>Edit the homepage carousel, product pictures, product details, prices, categories, and checkout catalog.</p>
        <button className="button glass compact" type="button" onClick={lockAdmin}>Lock admin</button>
      </div></section>

      <section className="container admin-section-block">
        <div className="admin-section-heading"><div><span className="eyebrow">Homepage Hero Carousel</span><h2>Edit the large carousel on the first screen.</h2><p>This controls the big rotating image area on the left side of the homepage hero.</p></div></div>
        <div className="hero-admin-grid">
          <aside className="card-panel hero-slide-list">
            <h3>Carousel slides</h3>
            {heroSlides.map((slide, index) => <button key={slide.id} type="button" className={slide.id === selectedHeroId ? 'hero-slide-row active' : 'hero-slide-row'} onClick={() => chooseHero(slide)}><img src={assetUrl(slide.image)} alt="" /><span><strong>Slide {index + 1}</strong><small>{slide.eyebrow || slide.title}</small></span></button>)}
          </aside>

          <form className="card-panel hero-editor" onSubmit={saveHero}>
            <div className="editor-context-card"><strong>You are editing:</strong><span>Homepage hero carousel slide</span><p>Image slot: the large left-side carousel image in the first viewport.</p></div>
            <div className="admin-form-grid">
              <label>Small label / eyebrow<input value={heroForm.eyebrow} onChange={(event) => updateHeroField('eyebrow', event.target.value)} /></label>
              <label>Button text<input value={heroForm.cta} onChange={(event) => updateHeroField('cta', event.target.value)} /></label>
            </div>
            <label>Hero title<input required value={heroForm.title} onChange={(event) => updateHeroField('title', event.target.value)} /></label>
            <label>Hero paragraph<textarea rows="3" value={heroForm.text} onChange={(event) => updateHeroField('text', event.target.value)} /></label>
            <label>Hero carousel image URL<input required value={heroForm.image} onChange={(event) => updateHeroField('image', event.target.value)} placeholder="https://... or /images/file.jpg" /></label>
            <label>Button link<select value={heroForm.href} onChange={(event) => updateHeroField('href', event.target.value)}><option value="/categories">Categories page</option><option value="/checkout">Checkout page</option><option value="/">Homepage</option></select></label>
            <button className="button primary" type="submit" disabled={saving}>Save hero slide</button>
            {heroMessage ? <p className="status-text">{heroMessage}</p> : null}
          </form>

          <aside className="card-panel hero-admin-preview">
            <span className="eyebrow">Dimensions</span>
            <div className="dimension-callout"><strong>{heroSpec?.pixels || '1600 x 820 px'}</strong><span>{heroSpec?.ratio || '80:41'} ratio</span><p>{heroSpec?.safeArea || 'Keep text-free subject matter inside the center safe area.'}</p></div>
            <div className="current-photo-card"><span>Current hero photo</span><img src={assetUrl(heroForm.image || selectedHero?.image)} alt="Current hero slide" /><small>{imageName(heroForm.image || selectedHero?.image)}</small></div>
            <form className="image-upload-form" onSubmit={uploadHeroImage}>
              <label>Upload hero poster<input type="file" name="image" accept={PHOTO_ACCEPT} /></label>
              <button className="button dark compact" type="submit" disabled={heroUploading}>{heroUploading ? 'Uploading...' : 'Upload poster'}</button>
            </form>
          </aside>
        </div>
      </section>


      <section className="container admin-section-block">
        <div className="admin-section-heading"><div><span className="eyebrow">Featured Collections Carousel</span><h2>Edit the category slides inside the hero card.</h2><p>This controls the rotating Featured collection slides and the category cards. These posters should be designed at {categorySpec?.pixels || '1200 x 720 px'}.</p></div></div>
        <div className="hero-admin-grid collection-admin-grid">
          <aside className="card-panel hero-slide-list">
            <h3>Collection slides</h3>
            {categories.map((category, index) => <button key={category.id} type="button" className={category.id === selectedCategoryId ? 'hero-slide-row active' : 'hero-slide-row'} onClick={() => chooseCategory(category)}><img src={assetUrl(category.image)} alt="" /><span><strong>Collection {index + 1}</strong><small>{category.name}</small></span></button>)}
          </aside>

          <form className="card-panel hero-editor" onSubmit={saveCategory}>
            <div className="editor-context-card"><strong>You are editing:</strong><span>Featured collection carousel slide</span><p>Image slot: the rotating category poster inside the hero carousel card and category grid.</p></div>
            <div className="admin-form-grid">
              <label>Collection name<input required value={categoryForm.name} onChange={(event) => updateCategoryField('name', event.target.value)} /></label>
              <label>Accent color<input type="color" value={categoryForm.color} onChange={(event) => updateCategoryField('color', event.target.value)} /></label>
            </div>
            <label>Collection tagline<textarea rows="3" value={categoryForm.tagline} onChange={(event) => updateCategoryField('tagline', event.target.value)} /></label>
            <label>Featured collection image URL<input required value={categoryForm.image} onChange={(event) => updateCategoryField('image', event.target.value)} placeholder="https://... or /images/file.jpg" /></label>
            <button className="button primary" type="submit" disabled={saving}>Save collection slide</button>
            {categoryMessage ? <p className="status-text">{categoryMessage}</p> : null}
          </form>

          <aside className="card-panel hero-admin-preview">
            <span className="eyebrow">Dimensions</span>
            <div className="dimension-callout"><strong>{categorySpec?.pixels || '1200 x 720 px'}</strong><span>{categorySpec?.ratio || '5:3'} ratio</span><p>{categorySpec?.safeArea || 'Keep product/category focus inside the center safe area.'}</p></div>
            <div className="current-photo-card"><span>Current collection photo</span><img src={assetUrl(categoryForm.image || selectedCategory?.image)} alt="Current featured collection" /><small>{imageName(categoryForm.image || selectedCategory?.image)}</small></div>
            <form className="image-upload-form" onSubmit={uploadCategoryImage}>
              <label>Upload featured collection poster<input type="file" name="image" accept={PHOTO_ACCEPT} /></label>
              <button className="button dark compact" type="submit" disabled={categoryUploading}>{categoryUploading ? 'Uploading...' : 'Upload poster'}</button>
            </form>
          </aside>
        </div>
      </section>

      <section className="container admin-section-block">
        <div className="admin-section-heading"><div><span className="eyebrow">Product Catalog</span><h2>Edit products and product pictures.</h2><p>Product card images should be {productSpec?.pixels || '900 x 720 px'}. Category carousel posters should be {categorySpec?.pixels || '1200 x 720 px'}.</p></div></div>
        <div className="admin-dashboard">
          <aside className="admin-sidebar card-panel"><div className="admin-sidebar-head"><div><span className="eyebrow">Catalog</span><h2>{products.length} products</h2></div><button className="button secondary compact" type="button" onClick={() => chooseProduct('new')}>New</button></div><div className="admin-product-list">{products.map((product) => <button key={product.id} className={String(product.id) === String(selectedId) ? 'admin-product-row active' : 'admin-product-row'} type="button" onClick={() => chooseProduct(String(product.id))}><img src={assetUrl(product.image)} alt="" /><span><strong>{product.name}</strong><small>{product.category} - KES {Number(product.price).toLocaleString()}</small></span></button>)}</div></aside>

          <form className="admin-editor card-panel" onSubmit={saveProduct}><div className="admin-editor-head"><div><span className="eyebrow">{selectedId === 'new' ? 'Create' : 'Edit'}</span><h2>{selectedId === 'new' ? 'Add a new product' : 'Edit product details'}</h2></div>{selectedId !== 'new' ? <button className="button danger compact" type="button" onClick={deleteProduct} disabled={saving}>Delete</button> : null}</div><div className="admin-form-grid"><label>Product name<input required value={form.name} onChange={(event) => updateField('name', event.target.value)} /></label><label>SKU<input value={form.sku} onChange={(event) => updateField('sku', event.target.value)} /></label><label>Price<input required type="number" min="0" value={form.price} onChange={(event) => updateField('price', event.target.value)} /></label><label>Category<select value={form.category} onChange={(event) => updateField('category', event.target.value)}>{categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></label><label>Badge<input value={form.badge} onChange={(event) => updateField('badge', event.target.value)} /></label><label>Stock status<input value={form.stock} onChange={(event) => updateField('stock', event.target.value)} /></label><label>Lead time<input value={form.leadTime} onChange={(event) => updateField('leadTime', event.target.value)} /></label><label>Rating<input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(event) => updateField('rating', event.target.value)} /></label></div><label>Image URL<input value={form.image} onChange={(event) => updateField('image', event.target.value)} placeholder="https://..." /></label><label>Description<textarea required rows="4" value={form.description} onChange={(event) => updateField('description', event.target.value)} /></label><label>Specs comma separated<input value={form.specs} onChange={(event) => updateField('specs', event.target.value)} /></label><label>Gallery URLs comma separated<input value={form.gallery} onChange={(event) => updateField('gallery', event.target.value)} /></label><div className="admin-actions"><button className="button primary" type="submit" disabled={saving}>{saving ? 'Saving...' : selectedId === 'new' ? 'Add product' : 'Save changes'}</button><button className="button secondary" type="button" onClick={() => chooseProduct(selectedId)}>Reset form</button></div>{message ? <p className="status-text">{message}</p> : null}</form>

          <aside className="admin-preview card-panel">
            <span className="eyebrow">Current product photos</span>
            <div className="dimension-mini"><strong>Product image:</strong> {productSpec?.pixels || '900 x 720 px'}</div>
            <div className="current-product-main">
              <span>Main catalog photo</span>
              <img src={assetUrl(previewProduct.image) || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'} alt="Current main product" />
              <small>{imageName(previewProduct.image)}</small>
            </div>
            <h2>{previewProduct.name || 'New product'}</h2>
            <p>{previewProduct.category || 'Category'} - KES {Number(previewProduct.price || 0).toLocaleString()}</p>
            <div className="spec-row detail">{(previewProduct.specs || []).slice(0, 4).map((spec) => <span key={spec}>{spec}</span>)}</div>
            <form className="image-upload-form" onSubmit={uploadImage}>
              <label>Replace main catalog photo<input type="file" name="image" accept={PHOTO_ACCEPT} /></label>
              <button className="button dark compact" type="submit" disabled={uploading || selectedId === 'new'}>{uploading ? 'Uploading...' : 'Replace main photo'}</button>
            </form>
            <div className="gallery-admin-panel">
              <div><strong>Gallery photos</strong><small>These are the extra photos on the product page. Upload into any slot to replace it.</small></div>
              <div className="gallery-admin-grid">
                {previewImages.map((image, index) => (
                  <form className="gallery-slot" key={`${image}-${index}`} onSubmit={(event) => uploadGalleryImage(event, index)}>
                    <img src={assetUrl(image)} alt={`Current product gallery ${index + 1}`} />
                    <span>{index === 0 ? 'Gallery 1 / main' : `Gallery ${index + 1}`}</span>
                    <small>{imageName(image)}</small>
                    <label>Replace<input type="file" name="image" accept={PHOTO_ACCEPT} /></label>
                    <button className="button secondary compact" type="submit" disabled={galleryUploading === index || selectedId === 'new'}>{galleryUploading === index ? 'Uploading...' : 'Replace'}</button>
                  </form>
                ))}
                {selectedId !== 'new' && previewImages.length < 6 ? (
                  <form className="gallery-slot empty" onSubmit={(event) => uploadGalleryImage(event, previewImages.length)}>
                    <div className="empty-image-slot">New</div>
                    <span>Add gallery photo</span>
                    <small>Optional extra product image</small>
                    <label>Choose<input type="file" name="image" accept={PHOTO_ACCEPT} /></label>
                    <button className="button secondary compact" type="submit" disabled={galleryUploading === previewImages.length}>Add photo</button>
                  </form>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
