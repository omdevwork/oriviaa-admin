'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, X, Plus, Loader, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import axios from 'axios'
import { BASE_URL } from '@/utils/url'
import { MultiSelect } from '../multi-select'

const collectionOptions = [
    { value: "60d21b9967d0d8992e610c88", label: "Collection 1" },
    { value: "60d21b9967d0d8992e610c89", label: "Collection 2" },
];

const INIT_FORM_DATA = {
    productName: '',
    category: '',
    collection: '',
    metalType: '',
    purity: '',
    metalWeight: '',
    description: ''
}

const initialSizeVariant = {
    size: '',
    additionalWeight: 0,
    stockLevel: 0
}

const initialImageField = {
    file: null,
    preview: '',
    alt: '',
    metal: '',
    gemstone: '',
    isPrimary: false
}

const metals = ['Gold', 'Silver', 'Platinum', 'Rose Gold']

function extractUniqueDiamondShapeNames(productTypes) {
    const shapeNames = productTypes
        ?.map(stone => stone.diamondShape.map(shape => shape.name.toLowerCase()))
        ?.flat();

    return [...new Set(shapeNames)];
}

export const DiamonFields = ({ diamonds, diamond, index, productTypes, updateDiamond, addDiamond, removeDiamond }) => {
    const [selectedStoneType, setSelectedStoneType] = useState(null);
    const [selectedStoneShape, setSelectedStoneShape] = useState(null);
    const [selectedMm, setSelectedMm] = useState(null);

    const handleChange = (id, field, value) => {
        updateDiamond(id, field, value);
        if (field === 'type') setSelectedStoneType(value);
        if (field === 'shape') setSelectedStoneShape(value);
        if (field === 'size') setSelectedMm(value);
    };

    console.log(extractUniqueDiamondShapeNames(productTypes), "productTypesproductTypes")

    // const nameOptions = productTypes?.map(type => ({ value: type.diamondType, label: type.diamondType }));
    // const shapeOptions = selectedStoneType ? productTypes?.find(type => type.diamondType === selectedStoneType)?.diamondShape?.map(v => ({ value: v.name, label: v.name })) : [];
    // const mmExtraxt = selectedStoneShape ? productTypes?.map(v => v?.diamondType === selectedStoneType && v?.diamondShape?.find(t => t?.name === selectedStoneShape)?.details?.map(d => d.mm)) : [];
    // const mmOptions = mmExtraxt?.filter(v => v != false)?.[0]?.map(s => ({ value: s, label: s }))

    const mmExtract = productTypes
        ?.map(v =>
            v?.diamondShape?.find(shape => shape.name === selectedStoneShape?.charAt(0).toUpperCase() + selectedStoneShape?.slice(1))
                ?.details?.map(d => d.mm)
        )
        .flat();

    const mmOptions = [...new Set(mmExtract)]?.map(s => ({ value: s, label: s })).filter(Boolean);

    // const caratWeightExtract = selectedStoneShape ? productTypes?.map(v => v?.diamondType === selectedStoneType && v?.diamondShape?.find(t => t?.name === selectedStoneShape)) : [];
    // const caratWeight = caratWeightExtract?.filter(v => v != false)?.[0]?.details?.find(d => d.mm === selectedMm)?.carat_weight

    const caratWeightExtract = productTypes
        ?.map(v =>
            v?.diamondShape?.find(shape => shape.name === selectedStoneShape?.charAt(0).toUpperCase() + selectedStoneShape?.slice(1))
                ?.details?.find(d => d.mm === selectedMm)
        )
        .filter(Boolean);

    const caratWeight = caratWeightExtract?.[0]?.carat_weight;

    // const qualityExtraxt = selectedStoneShape ? productTypes?.map(v => v?.diamondType === selectedStoneType && v?.diamondShape?.find(t => t?.name === selectedStoneShape)?.details?.map(d => d)) : [];
    // const qualityOptions = qualityExtraxt?.filter(v => v != false)?.[0]?.map(({ mm, carat_weight, _id, ...rest }) => {
    //     return removeNullValues(rest);
    // });

    // const allKeys = [...new Set(qualityOptions?.flatMap(Object.keys))]?.map(s => ({ value: s, label: s }));

    // function removeNullValues(obj) {
    //     return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
    // }

    useEffect(() => {
        updateDiamond(diamond.id, 'weight', caratWeight);
    }, [caratWeight])

    return (
        <div key={diamond.id} className="border bg-white p-4 rounded-md space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Diamond {index + 1}</h3>
                <div>
                    <Button type="button" onClick={() => removeDiamond(diamond.id)} variant="destructive" size="sm">
                        <X className="w-4 h-4" />
                    </Button>
                    {
                        diamonds?.length - 1 === index &&
                        <Button type="button" className="ml-3" onClick={addDiamond} variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                        </Button>
                    }
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                    <Label>Diamond Type</Label>
                    <Select
                        value={diamond.type}
                        onValueChange={(value) => handleChange(diamond.id, 'type', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select diamond" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                nameOptions?.map((diamond) => <SelectItem key={diamond?.value} value={diamond?.value}>{diamond?.label}</SelectItem>)
                            }
                        </SelectContent>
                    </Select>
                </div> */}
                <div className="space-y-2">
                    <Label>Diamond Shape</Label>
                    <Select
                        value={diamond.shape}
                        onValueChange={(value) => handleChange(diamond.id, 'shape', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                extractUniqueDiamondShapeNames(productTypes)?.map((shape) => <SelectItem key={shape} value={shape}>{shape?.charAt(0).toUpperCase() + shape.slice(1)}</SelectItem>)
                            }
                        </SelectContent>
                    </Select>
                </div>
                {/* <div className="space-y-2">
                    <Label>Quality</Label>
                    <Select
                        value={diamond.quality}
                        disabled={selectedStoneType === "CZ"}
                        onValueChange={(value) => handleChange(diamond.id, 'quality', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                allKeys?.map((quality) => <SelectItem key={quality?.value} value={quality?.value}>{quality?.label}</SelectItem>)
                            }
                        </SelectContent>
                    </Select>
                </div> */}
                <div className="space-y-2">
                    <Label>Diamond Position</Label>
                    <Select
                        value={diamond.position}
                        onValueChange={(value) => handleChange(diamond.id, 'position', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="side">Side</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Size (mm)</Label>
                    <Select
                        value={diamond.size}
                        disabled={!selectedStoneShape}
                        onValueChange={(value) => handleChange(diamond.id, 'size', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                mmOptions?.map((mm) => <SelectItem key={mm?.value} value={mm?.value}>{mm?.label}</SelectItem>)
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Carat Weight</Label>
                    <Input
                        type="number"
                        value={diamond.weight}
                        min="1"
                        disabled
                        readOnly
                    />
                </div>
                {/* {
                    diamond.position === "primary" &&
                    <div className="space-y-2">
                        <Label>Carat Weight Options</Label>
                        <MultiSelect
                            options={frameworksList}
                            value={diamond.size}
                            onValueChange={(e) => updateDiamond(diamond.id, 'weightOption', e)}
                            placeholder="Select carat options"
                            variant="inverted"
                            animation={2}
                            maxCount={3}
                        />
                    </div>
                } */}
                <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                        type="number"
                        value={diamond.quantity}
                        onChange={(e) => handleChange(diamond.id, 'quantity', parseInt(e.target.value))}
                        min="1"
                    />
                </div>
            </div>
        </div>
    )
}

export default function JewelryUploadPage() {

    const [formData, setFormData] = useState(INIT_FORM_DATA);
    const [diamonds, setDiamonds] = useState([{
        id: Date.now().toString(),
        size: '',
        shape: '',
        position: '',
        weight: '',
        weightOption: '',
        quantity: 0
    }]);
    const [categories, setCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([initialImageField]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(null);
    const [sizeVariants, setSizeVariants] = useState([initialSizeVariant]);

    const fileInputRefs = useRef([]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const clearFields = () => {
        setFormData(INIT_FORM_DATA);
        setImages(INIT_IMG_STATE);
        setDiamonds([]);
    }

    const handleSelectChange = (name, value) => {
        if (name === "metalType") {
            setImages(INIT_IMG_STATE)
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const addSizeVariant = () => {
        setSizeVariants([...sizeVariants, { ...initialSizeVariant }])
    }

    const removeSizeVariant = (index) => {
        const newSizeVariants = sizeVariants.filter((_, i) => i !== index)
        setSizeVariants(newSizeVariants)
    }

    const updateSizeVariant = (index, field, value) => {
        const newSizeVariants = [...sizeVariants]
        newSizeVariants[index] = { ...newSizeVariants[index], [field]: value }
        setSizeVariants(newSizeVariants)
    }


    const addImageField = () => {
        setImages([...images, { ...initialImageField }])
        fileInputRefs.current.push(null)
    }

    const removeImageField = (index) => {
        const newImages = images.filter((_, i) => i !== index)
        setImages(newImages)
        fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index)
        if (primaryImageIndex === index) {
            setPrimaryImageIndex(null)
        } else if (primaryImageIndex !== null && primaryImageIndex > index) {
            setPrimaryImageIndex(primaryImageIndex - 1)
        }
    }

    const updateImageField = (index, field, value) => {
        const newImages = [...images]
        newImages[index] = { ...newImages[index], [field]: value }

        if (field === 'isPrimary') {
            if (value === true) {
                // Deselect the previous primary image
                if (primaryImageIndex !== null && primaryImageIndex !== index) {
                    newImages[primaryImageIndex].isPrimary = false
                }
                setPrimaryImageIndex(index)
            } else {
                // If deselecting the primary image
                setPrimaryImageIndex(null)
            }
        }

        setImages(newImages)
    }

    const handleImageSelect = (index, file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            updateImageField(index, 'file', file)
            updateImageField(index, 'preview', reader.result)
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem("oriviaa_auth");
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/v1/category/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const categoryOptions = response?.data?.data?.map((category) => ({
                    value: category._id,
                    label: category.name,
                }));
                setCategories(categoryOptions);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchProductTypes = async () => {
            const token = localStorage.getItem("oriviaa_auth");
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/v1/stoneType/get-all-diamond-types`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setProductTypes(response?.data?.stoneTypes);
            } catch (error) {
                console.error("Error fetching product types:", error);
            }
        };

        fetchCategories();
        fetchProductTypes();
    }, []);

    const addDiamond = () => {
        const newDiamond = {
            id: Date.now().toString(),
            size: '',
            shape: '',
            position: '',
            weight: '',
            weightOption: '',
            quantity: 0
        }
        setDiamonds(prev => [...prev, newDiamond])
    }

    const updateDiamond = (id, field, value) => {
        setDiamonds(prev => prev.map(diamond =>
            diamond.id === id ? { ...diamond, [field]: value } : diamond
        ))
    }

    const removeDiamond = (id) => {
        setDiamonds(prev => prev.filter(diamond => diamond.id !== id))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("oriviaa_auth");
        setLoading(true);

        const payload = {
            ...formData,
            diamonds,
            images,
        };

        const formDataObj = new FormData();

        Object.keys(payload).forEach(key => {
            if (typeof payload[key] === 'string' || typeof payload[key] === 'number') {
                formDataObj.append(key, payload[key]);
            }
        });

        payload.diamonds.forEach((diamond, index) => {
            Object.keys(diamond).forEach(field => {
                if (field !== 'id') {
                    formDataObj.append(`diamonds[${index}][${field}]`, diamond[field]);
                }
            });
        });

        try {
            await fetch(`${BASE_URL}/api/v1/product`, {
                method: 'POST',
                body: formDataObj,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {
                if (res.success === true) {
                    setLoading(false);
                    clearFields();
                    alert("Product created!");
                }
            });
        } catch (err) {
            console.error('Error:', err);
            clearFields();
            setLoading(false);
            alert(err);
        }
    };

    if (categories?.length <= 0 || productTypes?.length <= 0) {
        return <div className="h-full flex-1 flex items-center justify-center">
            <Loader className="size-7 animate-spin text-muted-foreground" />
        </div>
    }

    if (loading) {
        return <div className="h-full flex-1 flex items-center justify-center">
            <Loader className="size-7 animate-spin text-muted-foreground" />
        </div>
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Upload Jewelry Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" name="productName" value={formData.productName} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)} name="category" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    categories?.map((cat) => <SelectItem key={cat?.value} value={cat?.value}>{cat?.label}</SelectItem>)
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Collection</Label>
                        <Select value={formData.collection} onValueChange={(value) => handleSelectChange('collection', value)} name="collection" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a collection" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    collectionOptions?.map((collection) => <SelectItem key={collection?.value} value={collection?.value}>{collection?.label}</SelectItem>)
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="metalType">Metal Type</Label>
                        <Select value={formData.metalType} onValueChange={(value) => handleSelectChange('metalType', value)} name="metalType" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select metal type" />
                            </SelectTrigger>
                            <SelectContent>
                                {metals.map((metal) => (
                                    <SelectItem key={metal} value={metal.toLowerCase()}>
                                        {metal}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="purity">Purity</Label>
                        <MultiSelect
                            name="purity"
                            required
                            disabled={!formData?.metalType}
                            options={formData?.metalType === "gold"
                                ? [
                                    { value: '10KT', label: '10KT' },
                                    { value: '14KT', label: '14KT' },
                                    { value: '18KT', label: '18KT' },
                                ] : [
                                    { value: '925', label: '925 (Sterling Silver)' }
                                ]
                            }
                            value={formData.purity}
                            onValueChange={(e) => handleSelectChange('purity', e)}
                            placeholder="Select purity"
                            variant="inverted"
                            animation={2}
                            maxCount={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Metal Weight</Label>
                        <Input id="metalWeight" type="number" name="metalWeight" value={formData.metalWeight} onChange={handleChange} required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>Diamonds</Label>
                        {
                            diamonds?.length <= 0 &&
                            <Button type="button" onClick={addDiamond} variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" /> Add Diamond
                            </Button>
                        }
                    </div>
                    {diamonds.map((diamond, index) => (
                        <DiamonFields
                            key={index}
                            diamonds={diamonds}
                            diamond={diamond}
                            index={index}
                            productTypes={productTypes}
                            updateDiamond={updateDiamond}
                            addDiamond={addDiamond}
                            removeDiamond={removeDiamond}
                        />
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>Size Variants</Label>
                    </div>
                    <Card className="space-y-2">
                        <CardContent className="p-4 space-y-2">
                            {sizeVariants.map((variant, index) => (
                                <div key={index} className="mb-2 p-4 border rounded-lg relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeSizeVariant(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor={`size-${index}`}>Size</Label>
                                            <Input
                                                id={`size-${index}`}
                                                value={variant.size}
                                                onChange={(e) => updateSizeVariant(index, 'size', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`additionalWeight-${index}`}>Additional Weight (g)</Label>
                                            <Input
                                                id={`additionalWeight-${index}`}
                                                type="number"
                                                value={variant.additionalWeight}
                                                onChange={(e) => updateSizeVariant(index, 'additionalWeight', parseFloat(e.target.value))}
                                                min="0"
                                                step="0.1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button type="button" onClick={addSizeVariant} className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Size Variant
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-2 ml-0">
                    <Label>Product Images</Label>
                    <ScrollArea className="w-full bg-white whitespace-nowrap rounded-md border">
                        <div className="flex space-x-4 p-4">
                            {images.map((image, index) => (
                                <div key={index} className="w-[300px] shrink-0 space-y-4 p-4 border rounded-lg relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeImageField(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div className="space-y-2">
                                        <Label htmlFor={`image-${index}`}>Image</Label>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRefs.current[index]?.click()}
                                            >
                                                <Upload className="mr-2 h-4 w-4" /> Select Image
                                            </Button>
                                            <Input
                                                id={`image-${index}`}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => e.target.files && handleImageSelect(index, e.target.files[0])}
                                                ref={(el) => (fileInputRefs.current[index] = el)}
                                            />
                                        </div>
                                        {image.preview && (
                                            <div className="mt-2 relative w-full h-40">
                                                <Image
                                                    src={image.preview}
                                                    alt="Preview"
                                                    fill
                                                    sizes="(max-width: 300px) 100vw, 300px"
                                                    style={{ objectFit: 'cover' }}
                                                    className="rounded-md"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`alt-${index}`}>Alt Text</Label>
                                        <Input
                                            id={`alt-${index}`}
                                            value={image.alt}
                                            onChange={(e) => updateImageField(index, 'alt', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`metal-${index}`}>Metal</Label>
                                        <Select
                                            value={image.metal}
                                            onValueChange={(value) => updateImageField(index, 'metal', value)}
                                        >
                                            <SelectTrigger id={`metal-${index}`}>
                                                <SelectValue placeholder="Select metal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {metals.map((metal) => (
                                                    <SelectItem key={metal} value={metal.toLowerCase()}>
                                                        {metal}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`gemstone-${index}`}>Gemstone</Label>
                                        <Select
                                            value={image.gemstone}
                                            onValueChange={(value) => updateImageField(index, 'gemstone', value)}
                                        >
                                            <SelectTrigger id={`gemstone-${index}`}>
                                                <SelectValue placeholder="Select gemstone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {extractUniqueDiamondShapeNames(productTypes).map((gemstone) => (
                                                    <SelectItem key={gemstone} value={gemstone.toLowerCase()}>
                                                        {gemstone?.charAt(0).toUpperCase() + gemstone.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`isPrimary-${index}`}
                                            checked={image.isPrimary}
                                            onCheckedChange={(checked) => updateImageField(index, 'isPrimary', checked === true)}
                                        />
                                        <Label htmlFor={`isPrimary-${index}`}>Primary Image</Label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    <Button type="button" onClick={addImageField} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                </div>
                <Button type="submit" className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Upload Product
                </Button>
            </form>
        </div>
    )
}
