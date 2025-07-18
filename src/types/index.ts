import type {ImageProps} from 'next/image'
import type {ImgHTMLAttributes} from 'react'

export interface ImageFilter {
    grayscale?: number
    sepia?: number
    brightness?: number
    contrast?: number
    blur?: number
}

export type ReactImageFilterProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'children'> & ImageFilter

export type NextImageFilterProps = Omit<ImageProps, 'children'> & ImageFilter
