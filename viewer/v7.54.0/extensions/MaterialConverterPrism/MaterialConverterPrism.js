/*!
 * LMV v7.54.0
 *
 * Copyright 2021 Autodesk, Inc.
 * All rights reserved.
 *
 * This computer source code and related instructions and comments are the
 * unpublished confidential and proprietary information of Autodesk, Inc.
 * and are protected under Federal copyright and state trade secret law.
 * They may not be disclosed to, copied or used by any third party without
 * the prior written consent of Autodesk, Inc.
 *
 * Autodesk Forge Viewer Usage Limitations:
 *
 * The Autodesk Forge Viewer JavaScript must be delivered from an
 * Autodesk-hosted URL.
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./extensions/MaterialConverterPrism/shaders/prism_frag.glsl":
/*!*******************************************************************!*\
  !*** ./extensions/MaterialConverterPrism/shaders/prism_frag.glsl ***!
  \*******************************************************************/
/***/ ((module) => {

module.exports = "\n#include<common>\n#define RECIPROCAL_PI 0.318309886\n#define ONE 0.00390625\nuniform float opacity;\nuniform vec3 surface_albedo;\nuniform float surface_roughness;\nuniform float surface_anisotropy;\nuniform float surface_rotation;\nuniform sampler2D importantSamplingRandomMap;\nuniform sampler2D importantSamplingSolidAngleMap;\n#if defined( PRISMOPAQUE )\nuniform vec3 opaque_albedo;\nuniform float opaque_f0;\nuniform vec3 opaque_luminance_modifier;\nuniform float opaque_luminance;\n#elif defined( PRISMMETAL )\nuniform vec3 metal_f0;\n#elif defined( PRISMLAYERED )\nuniform float layered_f0;\nuniform vec3 layered_diffuse;\nuniform float layered_fraction;\nuniform vec3 layered_bottom_f0;\nuniform float layered_roughness;\nuniform float layered_anisotropy;\nuniform float layered_rotation;\n#elif defined( PRISMTRANSPARENT )\nuniform float transparent_ior;\nuniform vec3 transparent_color;\nuniform float transparent_distance;\n#elif defined( PRISMGLAZING )\nuniform vec3 glazing_f0;\nuniform vec3 glazing_transmission_color;\nuniform float glazing_transmission_roughness;\n#elif defined( PRISMWOOD )\nuniform bool wood_fiber_cosine_enable;\nuniform int wood_fiber_cosine_bands;\nuniform vec4 wood_fiber_cosine_weights;\nuniform vec4 wood_fiber_cosine_frequencies;\nuniform bool wood_fiber_perlin_enable;\nuniform int wood_fiber_perlin_bands;\nuniform vec4 wood_fiber_perlin_weights;\nuniform vec4 wood_fiber_perlin_frequencies;\nuniform float wood_fiber_perlin_scale_z;\nuniform bool wood_growth_perlin_enable;\nuniform int wood_growth_perlin_bands;\nuniform vec4 wood_growth_perlin_weights;\nuniform vec4 wood_growth_perlin_frequencies;\nuniform float wood_latewood_ratio;\nuniform float wood_earlywood_sharpness;\nuniform float wood_latewood_sharpness;\nuniform float wood_ring_thickness;\nuniform bool wood_earlycolor_perlin_enable;\nuniform int wood_earlycolor_perlin_bands;\nuniform vec4 wood_earlycolor_perlin_weights;\nuniform vec4 wood_earlycolor_perlin_frequencies;\nuniform vec3 wood_early_color;\nuniform bool wood_use_manual_late_color;\nuniform vec3 wood_manual_late_color;\nuniform bool wood_latecolor_perlin_enable;\nuniform int wood_latecolor_perlin_bands;\nuniform vec4 wood_latecolor_perlin_weights;\nuniform vec4 wood_latecolor_perlin_frequencies;\nuniform float wood_late_color_power;\nuniform bool wood_diffuse_perlin_enable;\nuniform int wood_diffuse_perlin_bands;\nuniform vec4 wood_diffuse_perlin_weights;\nuniform vec4 wood_diffuse_perlin_frequencies;\nuniform float wood_diffuse_perlin_scale_z;\nuniform bool wood_use_pores;\nuniform int wood_pore_type;\nuniform float wood_pore_radius;\nuniform float wood_pore_cell_dim;\nuniform float wood_pore_color_power;\nuniform float wood_pore_depth;\nuniform bool wood_use_rays;\nuniform float wood_ray_color_power;\nuniform float wood_ray_seg_length_z;\nuniform float wood_ray_num_slices;\nuniform float wood_ray_ellipse_z2x;\nuniform float wood_ray_ellipse_radius_x;\nuniform bool wood_use_latewood_bump;\nuniform float wood_latewood_bump_depth;\nuniform bool wood_use_groove_roughness;\nuniform float wood_groove_roughness;\nuniform float wood_diffuse_lobe_weight;\nuniform sampler2D permutationMap;\nuniform sampler2D gradientMap;\nuniform sampler2D perm2DMap;\nuniform sampler2D permGradMap;\nuniform vec4 wood_ring_fraction;\nuniform vec2 wood_fall_rise;\n#endif\n#ifdef USE_TILING\nuniform mat4 tilingOverallTransform;\nuniform sampler2D TilingMap;\nuniform mat3 TilingMap_texMatrix;\nuniform vec4 uv2tile;\nuniform vec4 tile2uv;\nuniform vec2 tileAlignOffset;\nuniform mat4 tilingUVTransform;\n#ifdef USE_TILING_NORMAL\nuniform sampler2D TilingNormalMap;\nuniform mat3 TilingNormalMap_texMatrix;\n#endif\n#ifdef USE_TILING_RANDOM\nuniform sampler2D TilingRandomMap;\nuniform mat3 TilingRandomMap_texMatrix;\nuniform vec2 tilingRandomAxisS;\nuniform vec2 tilingRandomAxisT;\nuniform vec2 tilingRandomAlignmentOffset;\n#endif\n#endif\nuniform float envExponentMin;\nuniform float envExponentMax;\nuniform float envExponentCount;\n#include<env_sample>\n#if TONEMAP_OUTPUT > 0\nuniform float exposureBias;\n#include<tonemap>\n#endif\n#if MAX_SPOT_LIGHTS > 0 || NUM_CUTPLANES > 0\nvarying vec3 vWorldPosition;\n#endif\n#include<id_decl_frag>\n#include<theming_decl_frag>\n#include<shadowmap_decl_frag>\n#ifdef USE_FOG\nuniform vec3 fogColor;\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#prism_check<USE_MAP>\n#if defined(USE_MAP) || defined(USE_TILING)\nvarying vec2 vUv;\n#endif\n#if defined(PRISMWOOD) && !defined(NO_UVW)\nvarying vec3 vUvw;\n#endif\n#prism_uniforms<surface_albedo_map>\n#prism_uniforms<surface_roughness_map>\n#prism_uniforms<surface_cutout_map>\n#prism_uniforms<surface_anisotropy_map>\n#prism_uniforms<surface_rotation_map>\n#prism_uniforms<opaque_albedo_map>\n#prism_uniforms<opaque_f0_map>\n#prism_uniforms<opaque_luminance_modifier_map>\n#prism_uniforms<layered_bottom_f0_map>\n#prism_uniforms<layered_f0_map>\n#prism_uniforms<layered_diffuse_map>\n#prism_uniforms<layered_fraction_map>\n#prism_uniforms<layered_roughness_map>\n#prism_uniforms<layered_anisotropy_map>\n#prism_uniforms<layered_rotation_map>\n#prism_uniforms<metal_f0_map>\n#prism_uniforms<glazing_f0_map>\n#prism_uniforms<glazing_transmission_roughness_map>\n#prism_uniforms<glazing_transmission_color_map>\n#prism_uniforms<wood_curly_distortion_map>\n#if defined( USE_WOOD_CURLY_DISTORTION_MAP )\nuniform bool wood_curly_distortion_enable;\nuniform float wood_curly_distortion_scale;\n#endif\n#prism_bump_uniforms<surface_normal_map>\n#prism_bump_uniforms<layered_normal_map>\nfloat SRGBToLinearComponent(float color) {\n    float result = color;\n    if (result<=0.04045)\n        result *= 0.07739938;\n    else\n        result = pow(abs((result+0.055)*0.947867298), 2.4);\n    return result;\n}\nvec3 SRGBToLinear(vec3 color) {\n    vec3 result = color;\n    result.x = SRGBToLinearComponent(result.x);\n    result.y = SRGBToLinearComponent(result.y);\n    result.z = SRGBToLinearComponent(result.z);\n    return result;\n}\n#if defined( USE_ENVMAP )\nuniform float envMapExposure;\nuniform samplerCube envMap;\n#endif\n#include<normal_map>\n#if !defined(USE_MAP) && (MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0) || defined ( PRISMWOODBUMP )\nvarying vec3 vTangent;\nvarying vec3 vBitangent;\n#if defined( PRISMWOODBUMP )\nvarying vec3 vtNormal;\nvarying mat3 mNormalMatrix;\n#endif\n#endif\n#if defined( USE_ENVMAP )\nvec3 sampleReflection(vec3 N, vec3 V, float mipIndex) {\n    vec3 dir = (2.0 * dot(V, N)) * N - V;\n    dir = adjustLookupVector(mat3(viewMatrixInverse) * dir);\n#ifdef ENV_GAMMA\n#ifdef HAVE_TEXTURE_LOD\n    vec4 envTexColor = textureCubeLodEXT( envMap, dir, mipIndex );\n#else\n    vec4 envTexColor = textureCube( envMap, dir, mipIndex );\n#endif\n    return GammaDecode(envTexColor, envMapExposure);\n#elif defined(ENV_RGBM)\n#ifdef HAVE_TEXTURE_LOD\n    vec4 envTexColor = textureCubeLodEXT( envMap, dir, mipIndex );\n#else\n    vec4 envTexColor = textureCube( envMap, dir, mipIndex );\n#endif\n    return RGBMDecode(envTexColor, envMapExposure);\n#else\n    vec4 envTexColor = textureCube( envMap, dir );\n    vec3 cubeColor = envTexColor.xyz;\n#ifdef GAMMA_INPUT\n    cubeColor *= cubeColor;\n#endif\n    return cubeColor;\n#endif\n}\n#endif\n#include<hatch_pattern>\n#if defined( USE_ENVMAP ) && defined( USE_IRRADIANCEMAP )\nuniform samplerCube irradianceMap;\nvec3 sampleNormal(vec3 normal) {\n    vec3 worldNormal = mat3(viewMatrixInverse) * normal;\n    vec3 irradiance = sampleIrradianceMap(worldNormal, irradianceMap, envMapExposure);\n    irradiance = applyEnvShadow(irradiance, worldNormal);\n    return irradiance;\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#endif\nfloat sqr(float x) {return x*x;}\nfloat aSqrd(float maxAlphaSqr, float cosTheta)\n{\n    if (abs(cosTheta) < 1e-10)\n    {\n        return 1e10;\n    }\n    float tan2 = 1.0/sqr(cosTheta) - 1.0;\n    return maxAlphaSqr * tan2;\n}\nvec3 Fresnel_Schlick(vec3 f0, float cosAngle)\n{\n    float x = 1.0 - cosAngle;\n    float x2 = x * x;\n    float x5 = x * x2 * x2;\n    return f0 + (1.0 - f0) * x5;\n}\nvec3 Fresnel_Rough(vec3 f0, float cosAngle, float alpha)\n{\n    float x = 1.0 - cosAngle;\n    float x2 = x * x;\n    float x5 = x * x2 * x2;\n    vec3 maxReflectance = mix(vec3(1.0), f0, vec3(min(0.7, alpha)) / 0.7);\n    return f0 + (maxReflectance - f0) * x5;\n}\nfloat IORToReflectance(float ior)\n{\n    return sqr((1.0 - ior)/(1.0 + ior));\n}\nvec2 RoughnessToAlpha(float roughness, float anisotropy)\n{\n    vec2 alpha = roughness * vec2(1.0, 1.0 - anisotropy);\n    alpha = alpha * alpha;\n    alpha = clamp(alpha, 0.001, 1.0);\n    return alpha;\n}\nfloat AlphaToPhong(float alpha)\n{\n    return max(0.0, 2.56/alpha - 7.0);\n}\nfloat ExponentToReflMipIndex(float exponent)\n{\n    float targetLog = log2(exponent);\n    float minLog = log2(envExponentMin);\n    float maxLog = log2(envExponentMax);\n    float deltaLog = clamp(targetLog - minLog, 0.0, maxLog - minLog);\n    float level = clamp((1.0-(deltaLog + 0.5) / envExponentCount), 0.0, 1.0) * 6.0;\n    return level;\n}\n#include<prism_wood>\n#if defined( ENABLEIMPORTANTSAMPLING ) && (defined( USE_SURFACE_ROTATION_MAP ) || defined( USE_SURFACE_ANISOTROPY_MAP ) || defined( USE_LAYERED_ROTATION_MAP ) || defined( USE_LAYERED_ANISOTROPY_MAP ))\n#define IMPORTANTSAMPLING\n#endif\n#if defined( IMPORTANTSAMPLING )\n#define SAMPLECOUNT 32\nvec2 Hammersley(int index)\n{\n    float u = (float(index) + 0.5) / 32.0;\n    float v = 0.5;\n    float noise = texture2D(importantSamplingRandomMap, vec2(u, v), 0.0).r;\n   return vec2(2.0 * PI * float(index/SAMPLECOUNT), noise);\n}\nvec3 ImportanceSampleAnisotropicGGX(int index, vec2 alpha, vec3 N, vec3 Tu, vec3 Tv)\n{\n    vec2 uniformSample2D = Hammersley(index);\n    float coef = sqrt(uniformSample2D.y / (1.0 - uniformSample2D.y));\n    float sinSigma, cosSigma;\n    sinSigma = sin(uniformSample2D.x);\n    cosSigma = cos(uniformSample2D.x);\n    vec3 H = coef * ((alpha.x * cosSigma) * Tu + (alpha.y * sinSigma) * Tv) + N;\n    H = normalize(H);\n    return H;\n}\nfloat ComputePDF(vec2 alpha, float NdotH, float HdotTu, float HdotTv, float VdotH)\n{\n    float factor1 = HdotTu / alpha.x;\n    float factor2 = HdotTv / alpha.y;\n    float factor3 = factor1 * factor1 + factor2 * factor2 + NdotH * NdotH;\n    float factor = factor3 * factor3 * alpha.x * alpha.y * VdotH * 4.0 * PI;\n    if (factor > 0.0)\n    {\n        return (NdotH / factor);\n    }\n    else\n    {\n        return 0.0;\n    }\n}\n#define INVFACESIZE 0.0078125\nfloat DirectionToSolidAngle(vec3 dir)\n{\n    dir = abs(dir);\n    float first = min(dir.x, dir.y);\n    float temp = max(dir.x, dir.y);\n    float second = min(temp, dir.z);\n    float third = max(temp, dir.z);\n    first /= third;\n    second /= third;\n    float u = (first+1.0)/2.0;\n    float v = (second + 1.0) / 2.0;\n    float solidAngle = texture2D(importantSamplingSolidAngleMap, vec2(u, v), 0.0).r * 0.000255;\n    return solidAngle;\n}\nfloat Smith_GGX(float value)\n{\n    return 2.0 / (1.0 + sqrt(1.0 + value));\n}\nvec2 RoughnessAnisotropyToAlpha(float roughness, float anisotropy)\n{\n    float aspect = sqrt(1.0 - 0.9 * anisotropy);\n    vec2 alpha = vec2(roughness * roughness / aspect, roughness * roughness * aspect);\n    return alpha;\n}\nvec3 ImportanceSamplingSpecular(float angle, vec3 reflectance, float roughness, float anisotropy, vec3 V, vec3 N, vec3 Tu, vec3 Tv)\n{\n    vec3 specular = vec3(0.0);\n    float radAngle;\n    if (anisotropy < 1e-10)\n    {\n        radAngle = 0.0;\n    }\n    else\n    {\n        radAngle = -PI * angle;\n    }\n    vec2 alpha = RoughnessAnisotropyToAlpha(roughness, anisotropy);\n    float alpha2 = max(alpha.x * alpha.x, alpha.y * alpha.y);\n    float NdotV = dot(N, V);\n    float alpha2NV = aSqrd(alpha2, NdotV);\n    vec2 sincosTheta;\n    sincosTheta.x = sin(radAngle);\n    sincosTheta.y = cos(radAngle);\n    vec3 Tu1, Tv1;\n    Tu1 = sincosTheta.y * Tu - sincosTheta.x * Tv;\n    Tv1 = sincosTheta.x * Tu + sincosTheta.y * Tv;\n    vec3 H;\n    vec3 sampleLightIntensity;\n    vec3 L;\n    float effectiveSample = 0.0;\n    for (int i = 0; i < SAMPLECOUNT; i++)\n    {\n        H = ImportanceSampleAnisotropicGGX(i, alpha, N, Tu1, Tv1);\n        float VdotH = dot(V, H);\n        L = 2.0 * VdotH * H - V;\n        float NdotH = dot(N, H);\n        float NdotL = dot(N, L);\n        if (NdotL >= 0.0 && NdotV > 0.0 && NdotH > 0.0)\n        {\n            float alpha2NL = aSqrd(alpha2, NdotL);\n            float HdotTu = dot(H, Tu1);\n            float HdotTv = dot(H, Tv1);\n            float pdf = ComputePDF(alpha, NdotH, HdotTu, HdotTv, VdotH);\n            float mipmapLevel = 0.0;\n            if (pdf > 0.0)\n            {\n                mipmapLevel = 0.3 * log2(1.0 / (float(SAMPLECOUNT) * pdf * DirectionToSolidAngle(L)));\n            }\n            mipmapLevel = clamp(mipmapLevel, 0.0, 4.0);\n            L = normalize(L);\n            sampleLightIntensity = sampleReflection(L, L, mipmapLevel).rgb;\n            float G = Smith_GGX(alpha2NL) * Smith_GGX(alpha2NV);\n            vec3 F = Fresnel_Schlick(reflectance, VdotH);\n            float factor = G * VdotH / (NdotH * NdotV);\n            if (factor >= 0.0)\n            {\n                specular += abs(sampleLightIntensity * F * factor);\n                effectiveSample += 1.0;\n            }\n        }\n    }\n    if (effectiveSample > 0.0)\n    {\n        specular /= effectiveSample;\n    }\n    return specular;\n}\n#endif\n#if MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0\nvec3 DiffuseLobe(vec3 diffuseColor)\n{\n    return diffuseColor * RECIPROCAL_PI;\n}\nvec3 Rotate(vec3 vec, float angle)\n{\n    float s = sin(angle);\n    float c = cos(angle);\n    return vec3(vec.x * c - vec.y * s, vec.x * s + vec.y * c, vec.z);\n}\nfloat NDF_GGX(float alphaU, float alphaV, vec3 normal)\n{\n    float nx2 = sqr(normal.x);\n    float ny2 = sqr(normal.y);\n    float nz2 = sqr(normal.z);\n    float scale = 1.0/(alphaU * alphaV * PI);\n    return scale/sqr(nx2/sqr(alphaU) + ny2/sqr(alphaV) + nz2);\n}\nfloat G1_GGX(float aSqrd)\n{\n    return 2.0 / (1.0 + sqrt(1.0 + aSqrd));\n}\nvec3 MicrofacetLobe(\n        vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH,\n        float roughness, float anisotropy, float rotation, vec3 reflectance)\n{\n    vec2 alpha = RoughnessToAlpha(roughness, anisotropy);\n    Hlocal = Rotate(Hlocal, rotation);\n    vec3 F = Fresnel_Schlick(reflectance, VdotH);\n    float D = NDF_GGX(alpha.x, alpha.y, Hlocal);\n    float alpha2 = max(sqr(alpha.x), sqr(alpha.y));\n    float alpha2NL = aSqrd(alpha2, NdotL);\n    float alpha2NV = aSqrd(alpha2, NdotV);\n    float G = G1_GGX(alpha2NL) * G1_GGX(alpha2NV);\n    return max(F * D * G / (4.0 * NdotL * NdotV), vec3(0.0));\n}\n#if defined( PRISMOPAQUE )\nvec3 BRDF_Opaque(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH,\n        vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation,\n        float opaqueF0, vec3 opaqueAlbedo)\n{\n    vec3 diffuse = DiffuseLobe(opaqueAlbedo);\n    vec3 specular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, surfaceAnisotropy, surfaceRotation, vec3(opaqueF0));\n    return (specular+diffuse)*NdotL;\n}\n#elif defined( PRISMMETAL )\nvec3 BRDF_Metal(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH,\n        vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation,\n        vec3 metalF0)\n{\n    vec3 specular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, surfaceAnisotropy, surfaceRotation, metalF0);\n    return specular*NdotL;\n}\n#elif defined( PRISMLAYERED )\nvec3 BRDF_Layered(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH,\n        vec3 Hlocal2, float N2dotL, float N2dotH, float N2dotV,\n        vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation,\n        float layeredF0, vec3 layeredDiffuse, float layeredRoughness, float layeredAnisotropy,\n        float layeredRotation, vec3 bottom_f0, float layeredFraction)\n{\n    vec3 Fl = Fresnel_Schlick(vec3(layeredF0), NdotL);\n    vec3 Fv = Fresnel_Schlick(vec3(layeredF0), NdotV);\n    vec3 amount = (1.0 - Fl) * (1.0 - Fv);\n    vec3 topSpecular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, surfaceAnisotropy, surfaceRotation,\n            vec3(layeredF0));\n    vec3 topDiffuse = DiffuseLobe(layeredDiffuse);\n    vec3 botSpecular = MicrofacetLobe(\n            Hlocal2, N2dotL, N2dotH, N2dotV, VdotH,\n            layeredRoughness, layeredAnisotropy, layeredRotation,\n            bottom_f0);\n    return topSpecular*NdotL + amount * mix(topDiffuse*NdotL, botSpecular*N2dotL, layeredFraction);\n}\n#elif defined( PRISMTRANSPARENT )\nvec3 BRDF_Transparent(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH,\n        vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation)\n{\n    vec3 reflectance = vec3(IORToReflectance(transparent_ior));\n    vec3 specular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, surfaceAnisotropy, surfaceRotation, reflectance);\n    return specular*NdotL;\n}\n#elif defined( PRISMGLAZING )\nvec3 BRDF_Glazing(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH,\n        vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation,\n        vec3 glazingF0, vec3 glazingTransmissionColor, float glazingIlluminance)\n{\n    vec3 diffuse = DiffuseLobe(glazingTransmissionColor - vec3(glazingIlluminance, glazingIlluminance, glazingIlluminance));\n    vec3 specular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, surfaceAnisotropy, surfaceRotation, glazingF0);\n    return (specular+diffuse)*NdotL;\n}\n#elif defined( PRISMWOOD )\nvec3 BRDF_Wood(vec3 Hlocal, float NdotL, float NdotH, float NdotV, float VdotH,\n        vec3 surfaceAlbedo, float surfaceRoughness, vec3 woodDiffuse)\n{\n    vec3 diffuse = DiffuseLobe(woodDiffuse);\n    vec3 specular = surfaceAlbedo * MicrofacetLobe(\n            Hlocal, NdotL, NdotH, NdotV, VdotH,\n            surfaceRoughness, 0.0, 0.0, vec3(0.04));\n    return (specular+diffuse)*NdotL;\n}\n#endif\n#endif\n#if defined( USE_ENVMAP )\n#if defined( PRISMOPAQUE )\nvec3 Environment_Opaque(vec3 N, vec3 V, float NdotV, vec3 surfaceAlbedo, float surfaceRoughness,\n        float opaqueF0, vec3 opaqueAlbedo, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 T)\n{\n    float alpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n    vec3 F = Fresnel_Rough(vec3(opaqueF0), NdotV, alpha);\n#if defined( IMPORTANTSAMPLING )\n    vec3 specular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, vec3(opaqueF0), surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float exponent = AlphaToPhong(alpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 specular = F* surfaceAlbedo * envSpecular;\n#endif\n#if defined( USE_IRRADIANCEMAP )\n    vec3 envIrradiance = sampleNormal(N);\n#else\n    vec3 envIrradiance = vec3(1.0);\n#endif\n    vec3 diffuse = (1.0 - F) * opaqueAlbedo * envIrradiance;\n    return diffuse + specular;\n}\n#elif defined( PRISMMETAL )\nvec3 Environment_Metal(vec3 N, vec3 V, float NdotV, vec3 surfaceAlbedo, float surfaceRoughness, vec3 metalF0, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 Tv)\n{\n#if defined( IMPORTANTSAMPLING )\n    vec3 specular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, metalF0, surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float alpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n    float exponent = AlphaToPhong(alpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 F = Fresnel_Rough(metalF0, NdotV, alpha);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 specular = F * surfaceAlbedo * envSpecular;\n#endif\n    return specular;\n}\n#elif defined( PRISMLAYERED )\nvec3 Environment_Layered(vec3 N, vec3 V, float NdotV, vec3 N2, float N2dotV, vec3 surfaceAlbedo, float surfaceRoughness,\n        float layeredF0, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 Tv, vec3 layeredDiffuse, float layeredRoughness,\n        float layeredAnisotropy, float layeredRotation, vec3 bottom_f0, float layeredFraction)\n{\n    vec3 F = Fresnel_Schlick(vec3(layeredF0), NdotV);\n    float alpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n#if defined( IMPORTANTSAMPLING )\n    vec3 topSpecular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, vec3(layeredF0), surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float exponent = AlphaToPhong(alpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 topSpecular = F * surfaceAlbedo * envSpecular;\n#endif\n    vec3 amount = (1.0 - F);\n#if defined( USE_IRRADIANCEMAP )\n    vec3 envIrradiance = sampleNormal(N);\n#else\n    vec3 envIrradiance = vec3(1.0);\n#endif\n    vec3 topDiffuse = layeredDiffuse * envIrradiance;\n#if defined( IMPORTANTSAMPLING )\n    vec3 botSpecular = ImportanceSamplingSpecular(layeredRotation, bottom_f0, layeredRoughness, layeredAnisotropy, V, N2, Tu, Tv);\n#else\n    alpha = RoughnessToAlpha(layeredRoughness, 0.0).x;\n    exponent = AlphaToPhong(alpha);\n    reflMipIndex = ExponentToReflMipIndex(exponent);\n    envSpecular = sampleReflection(N2, V, reflMipIndex);\n    F = Fresnel_Rough(bottom_f0, N2dotV, alpha);\n    vec3 botSpecular = F * envSpecular;\n#endif\n    return topSpecular + amount * mix(topDiffuse, botSpecular, layeredFraction);\n}\n#elif defined( PRISMTRANSPARENT )\nvec3 Environment_Transparent(vec3 N, vec3 V, float NdotV, vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 Tv)\n{\n    vec3 reflectance = vec3(IORToReflectance(transparent_ior));\n    float alpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n    vec3 F = Fresnel_Rough(reflectance, NdotV, alpha);\n#if defined( IMPORTANTSAMPLING )\n    vec3 specular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, reflectance, surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float exponent = AlphaToPhong(alpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 specular = F * surfaceAlbedo * envSpecular;\n#endif\n#if defined( USE_IRRADIANCEMAP )\n    vec3 envIrradiance = sampleNormal(N);\n#else\n    vec3 envIrradiance = vec3(1.0);\n#endif\n    vec3 color = F * surfaceRoughness * transparent_color * envIrradiance;\n    return specular + color;\n}\n#elif defined( PRISMGLAZING )\nvec3 Environment_Glazing(vec3 N, vec3 V, float NdotV, vec3 surfaceAlbedo, float surfaceRoughness, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 Tv,\n                         vec3 glazing_f0, vec3 transmissionF, float transmissionAlpha, vec3 glazingAdjustedColor, float glazingIlluminace)\n{\n    float surfaceAlpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n    vec3 surfaceF = Fresnel_Rough(glazing_f0, NdotV, surfaceAlpha);\n#if defined( IMPORTANTSAMPLING )\n    vec3 specular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, glazing_f0, surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float exponent = AlphaToPhong(surfaceAlpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 specular = surfaceF * surfaceAlbedo * envSpecular;\n#endif\n#if defined( USE_IRRADIANCEMAP )\n    vec3 envIrradiance = sampleNormal(N);\n#else\n    vec3 envIrradiance = vec3(1.0);\n#endif\n    vec3 color = 0.5 * (1.0 - transmissionF) * (glazingAdjustedColor - vec3(glazingIlluminace, glazingIlluminace, glazingIlluminace)) * envIrradiance; \n    return specular + color;\n}\n#elif defined( PRISMWOOD )\nvec3 Environment_Wood(vec3 N, vec3 V, float NdotV, vec3 surfaceAlbedo, float surfaceRoughness, vec3 woodDiffuse, float surfaceAnisotropy, float surfaceRotation, vec3 Tu, vec3 Tv)\n{\n    float alpha = RoughnessToAlpha(surfaceRoughness, 0.0).x;\n    vec3 F = Fresnel_Rough(vec3(0.04), NdotV, alpha);\n#if defined( IMPORTANTSAMPLING )\n    vec3 specular = surfaceAlbedo * ImportanceSamplingSpecular(surfaceRotation, vec3(0.04), surfaceRoughness, surfaceAnisotropy, V, N, Tu, Tv);\n#else\n    float exponent = AlphaToPhong(alpha);\n    float reflMipIndex = ExponentToReflMipIndex(exponent);\n    vec3 envSpecular = sampleReflection(N, V, reflMipIndex);\n    vec3 specular = F * surfaceAlbedo * envSpecular;\n#endif\n#if defined( USE_IRRADIANCEMAP )\n    vec3 envIrradiance = sampleNormal(N);\n#else\n    vec3 envIrradiance = vec3(1.0);\n#endif\n    vec3 diffuse = (1.0 - F) * woodDiffuse * envIrradiance;\n    return diffuse + specular;\n}\n#endif\n#endif\n#if defined( PRISMTRANSPARENT )\n#include <prism_transparency>\n#elif defined( PRISMGLAZING )\n#include <prism_glazing>\n#endif\n#ifdef USE_TILING\nvec3 tilingTransform(vec2 uv, mat4 transform)\n{\n\treturn (transform * vec4(uv, 0.0, 1.0)).xyz;\n}\nvec4 tilingMapTest(sampler2D tilingSampler, mat3 transf, vec3 uv, vec4 uv2tile, vec4 tile2uv)\n{\n\tvec2 tileCoord = vec2(dot(uv2tile.xz, uv.xy), dot(uv2tile.yw, uv.xy));\n\tvec2 ijBase = floor(tileCoord);\n    vec2 fracC = fract(tileCoord);\n\tvec2 st = vec2(dot(tile2uv.xz, fracC), dot(tile2uv.yw, fracC));\n\tvec4 tileInfo = vec4(0.0, 0.0, 2.0, 2.0);\n\tvec2 iOffset = float(TILE_RANGE_X_MIN) * tile2uv.xy;\n\tvec2 jBaseOffset = float(TILE_RANGE_Y_MIN) * tile2uv.zw;\n\tfor( int i = TILE_RANGE_X_MIN; i <= TILE_RANGE_X_MAX; i++)\n\t{\n\t\tvec2 jOffset = jBaseOffset;\n\t\tfor( int j = TILE_RANGE_Y_MIN; j <= TILE_RANGE_Y_MAX; j++)\n\t\t{\n\t\t\tvec2 sampleUV = st + iOffset + jOffset;\n\t\t\tjOffset += tile2uv.zw;\n\t\t\tsampleUV = (transf * vec3(sampleUV, 1.0)).xy;\n\t\t\tvec4 tex = texture2D(tilingSampler, sampleUV);\n\t\t\tfloat d = max( min(tex.r, tex.g), min( max(tex.r, tex.g), tex.b));\n            if (d < tileInfo.z) {\n\t\t\t\ttileInfo.xy = vec2(float(i),float(j));\n\t\t\t\ttileInfo.w = tileInfo.z;\n\t\t\t\ttileInfo.z = d;\n\t\t\t} else {\n\t\t\t\ttileInfo.w = min(tileInfo.w, d);\n\t\t\t}\n\t\t}\n\t\tiOffset += tile2uv.xy;\n\t}\n\ttileInfo.zw = tileInfo.zw - 0.5;\n\tfloat w = clamp(tileInfo.z/max(fwidth(tileInfo.z), 0.000001) + 0.5, 0.0, 1.0);\n\tif ( w == 1.0 )\n\t\tdiscard;\n \tif (abs(tileInfo.w)<=abs(tileInfo.z))\n\t\tw = 0.0;\n\ttileInfo.w = 1.0 - w;\n\ttileInfo.xy -= ijBase;\n\treturn tileInfo;\n}\nvec2 tilingSubMaterialRelocate(vec3 uv, vec4 tileInfo, vec4 tile2uv)\n{\n\tvec2 offset = vec2(dot(tile2uv.xz, tileInfo.xy), dot(tile2uv.yw, tileInfo.xy));\n\treturn (uv.xy + offset);\n}\n#ifdef USE_TILING_RANDOM\nvec2 tilingRandom(vec2 uv, vec4 tileInfo, sampler2D randomSampler, mat3 transf, vec2 tileTextureAxisS, vec2 tileTextureAxisT, vec2 tile2TextureOffset)\n{\n    vec2 xti = (vec3(tileInfo.xy, 1.0) * transf).xy;\n    vec4 random = texture2D(randomSampler, xti);\n    vec2 randomOffset = vec2(tileTextureAxisS.x*random.z + tileTextureAxisT.x*random.w,\n        tileTextureAxisS.y*random.z + tileTextureAxisT.y*random.w) + tile2TextureOffset;\n    return uv + randomOffset;\n}\n#endif\nvoid tilingNormalOffset(\n    sampler2D bumpTexture,\n    vec2 uv,\n    mat3 transform,\n    inout vec3 T,\n    inout vec3 B,\n    inout vec3 N\n) {\n    vec2 st = (vec3(uv, 1.0) * transform).xy;\n    vec3 distort =  (2.0 * texture2D(bumpTexture, st).xyz - 1.0) - vec3(0.0,0.0,1.0);\n    mat3 mat = mat3(\n        T.x, B.x, N.x,\n        T.y, B.y, N.y,\n        T.z, B.z, N.z\n    );\n    N = normalize(N + (mat*distort));\n}\n#endif\nvarying vec3 vNormal;\nvarying vec3 vViewPosition;\n#include<cutplanes>\nvoid main() {\n#if NUM_CUTPLANES > 0\n    checkCutPlanes(vWorldPosition);\n#endif\n    vec3 N = normalize(vNormal);\n    vec3 Tu = vec3(0.0);\n    vec3 Tv = vec3(0.0);\n#if defined(USE_MAP) || defined(USE_TILING)\n    vec2 uv = vUv;\n#endif\n#ifdef USE_TILING\n    vec3 v_tilingOverallTransf = tilingTransform( vUv, tilingOverallTransform );\n    vec4 v_TilingMap = tilingMapTest( TilingMap, TilingMap_texMatrix, v_tilingOverallTransf, uv2tile, tile2uv );\n    uv = tilingSubMaterialRelocate( v_tilingOverallTransf, v_TilingMap, tile2uv ) + tileAlignOffset;\n#ifdef USE_TILING_NORMAL\n    vec2 uvNorm = uv;\n#endif\n#ifdef USE_TILING_RANDOM\n    uv = tilingRandom( uv, v_TilingMap, TilingRandomMap, TilingRandomMap_texMatrix, tilingRandomAxisS, tilingRandomAxisT, tilingRandomAlignmentOffset );\n#endif\n    uv = tilingTransform( uv, tilingUVTransform ).xy;\n#endif\n#if defined( USE_SURFACE_NORMAL_MAP ) || defined( USE_LAYERED_NORMAL_MAP ) || MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0 || defined( PRISMWOODBUMP ) || defined( IMPORTANTSAMPLING )\n#if !defined(USE_MAP) || defined( PRISMWOODBUMP )\n    Tu = normalize(vTangent);\n    Tv = normalize(vBitangent);\n#else\n    vec3 q0 = dFdx( -vViewPosition );\n    vec3 q1 = dFdy( -vViewPosition );\n    vec2 st0 = dFdx( uv );\n    vec2 st1 = dFdy( uv );\n    Tu = normalize(  q0 * st1.t - q1 * st0.t );\n    Tv = normalize( -q0 * st1.s + q1 * st0.s );\n#endif\n#endif\n    vec3 V;\n    if (projectionMatrix[3][3] == 0.0) {\n        V = normalize( vViewPosition );\n    } else {\n        V = vec3(0.0, 0.0, 1.0);\n    }\n    N = faceforward(N, -V, N);\n#if defined(PRISMLAYERED)\n    vec3 N2 = N;\n#endif\n#ifndef FLAT_SHADED\n    vec3 normal = normalize( vNormal );\n#ifdef DOUBLE_SIDED\n    normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#else\n    vec3 fdx = dFdx( vViewPosition );\n    vec3 fdy = dFdy( vViewPosition );\n    vec3 normal = normalize( cross( fdx, fdy ) );\n#endif\n    vec3 geomNormal = normal;\n#if defined( USE_SURFACE_NORMAL_MAP )\n    if (surface_normal_map_bumpmapType == 0)\n        heightMapTransform(surface_normal_map, uv, surface_normal_map_texMatrix, surface_normal_map_bumpScale, Tu, Tv, N);\n    else\n        normalMapTransform(surface_normal_map, uv, surface_normal_map_texMatrix, surface_normal_map_bumpScale, Tu, Tv, N);\n#endif\n#if defined( USE_LAYERED_NORMAL_MAP )\n    if (layered_normal_map_bumpmapType == 0)\n        heightMapTransform(layered_normal_map, uv, layered_normal_map_texMatrix, layered_normal_map_bumpScale, Tu, Tv, N2);\n    else\n        normalMapTransform(layered_normal_map, uv, layered_normal_map_texMatrix, layered_normal_map_bumpScale, Tu, Tv, N2);\n#endif\n#ifdef USE_TILING_NORMAL\n    tilingNormalOffset(TilingNormalMap, uvNorm, TilingNormalMap_texMatrix, Tu, Tv, N);\n#endif\n#if defined( PRISMWOOD )\n#ifdef NO_UVW\n    vec3 p = vec3(0.0);\n#elif defined( USE_WOOD_CURLY_DISTORTION_MAP )\n    vec3 p = DistortCurly(vUvw);\n#else\n    vec3 p = vUvw;\n#endif\n#if !defined( NO_UVW ) && defined( PRISMWOODBUMP )\n    getFinalWoodContext(\n        N, V, Tu, Tv, p,\n        normal, vtNormal, vNormalMatrix\n    );\n#endif\n#endif\n    float NdotV = clamp(dot(N, V), EPSILON, 1.0);\n#if defined(PRISMLAYERED)\n    float N2dotV = clamp(dot(N2, V), EPSILON, 1.0);\n#endif\n    vec3 surfaceAlbedo;\n#prism_sample_texture<surface_albedo, surfaceAlbedo, false, true>\n    float surfaceRoughness;\n#prism_sample_texture<surface_roughness, surfaceRoughness, true, false>\n    float surfaceAnisotropy;\n#prism_sample_texture<surface_anisotropy, surfaceAnisotropy, true, false>\n    float surfaceRotation;\n#prism_sample_texture<surface_rotation, surfaceRotation, true, false>\n#if defined(PRISMOPAQUE)\n    float opaqueF0;\n#prism_sample_texture<opaque_f0, opaqueF0, true, false>\n    vec3 opaqueAlbedo;\n#prism_sample_texture<opaque_albedo, opaqueAlbedo, false, true>\n#elif defined(PRISMMETAL)\n    vec3 metalF0;\n#prism_sample_texture<metal_f0, metalF0, false, true>\n#elif defined(PRISMLAYERED)\n    float layeredF0;\n#prism_sample_texture<layered_f0, layeredF0, true, false>\n    vec3 layeredDiffuse;\n#prism_sample_texture<layered_diffuse, layeredDiffuse, false, true>\n    float layeredRoughness;\n#prism_sample_texture<layered_roughness, layeredRoughness, true, false>\n    float layeredAnisotropy;\n#prism_sample_texture<layered_anisotropy, layeredAnisotropy, true, false>\n    float layeredRotation;\n#prism_sample_texture<layered_rotation, layeredRotation, true, false>\n    vec3 bottom_f0;\n#prism_sample_texture<layered_bottom_f0, bottom_f0, false, true>\n    float layeredFraction;\n#prism_sample_texture<layered_fraction, layeredFraction, true, false>\n#elif defined( PRISMGLAZING )\n    vec3 glazingTransmissionColor;\n#prism_sample_texture<glazing_transmission_color, glazingTransmissionColor, false, true>\n    vec3 glazingF0;\n#prism_sample_texture<glazing_f0, glazingF0, false, true>\n    float glazingTransmissionRoughness;\n#prism_sample_texture<glazing_transmission_roughness, glazingTransmissionRoughness, true, false>\n    vec3 glazingAdjustedColor = TransmitAdjust(glazingTransmissionColor, glazingF0);\n    float glazingIlluminace = ColorToIlluminance(glazingAdjustedColor);\n    float transmissionAlpha = RoughnessToAlpha(glazingTransmissionRoughness, 0.0).x;\n    vec3 transmissionF = Fresnel_Rough(glazingF0, NdotV, transmissionAlpha);\n#elif defined(PRISMWOOD)\n    vec3 woodDiffuse = NoiseWood(p, surfaceRoughness);\n#endif\n    vec3 outRadianceLight = vec3(0.0);\n#if MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0\n    vec3 lightDirection[ MAX_DIR_LIGHTS + MAX_POINT_LIGHTS + MAX_SPOT_LIGHTS ];\n    vec3 lightColor[ MAX_DIR_LIGHTS + MAX_POINT_LIGHTS + MAX_SPOT_LIGHTS ];\n#if MAX_DIR_LIGHTS > 0\n    for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n        vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n        lightDirection[i] = normalize( lDirection.xyz );\n        lightColor[i] = SRGBToLinear(directionalLightColor[ i ]);\n    }\n#endif\n#if MAX_POINT_LIGHTS > 0\n    for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n        vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n        vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n        lightDirection[MAX_DIR_LIGHTS + i] = normalize( lVector );\n        float lDistance = 1.0;\n        if ( pointLightDistance[ i ] > 0.0 )\n            lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\n        lightColor[MAX_DIR_LIGHTS + i] = SRGBToLinear(pointLightColor[ i ]) * lDistance;\n    }\n#endif\n#if MAX_SPOT_LIGHTS > 0\n    for( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n        vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n        vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n        lightDirection[MAX_DIR_LIGHTS + MAX_POINT_LIGHTS + i] = normalize( lVector );\n        float lDistance = 1.0;\n        if ( spotLightDistance[ i ] > 0.0 )\n            lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\n        float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\n        if ( spotEffect > spotLightAngleCos[ i ] )\n            spotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\n        lightColor[MAX_DIR_LIGHTS + MAX_POINT_LIGHTS + i] = SRGBToLinear(spotLightColor[ i ]) * lDistance * spotEffect;\n    }\n#endif\n    for( int i = 0; i < MAX_DIR_LIGHTS + MAX_POINT_LIGHTS + MAX_SPOT_LIGHTS; i ++ ) {\n        vec3 L = lightDirection[i];\n        float NdotL = max(EPSILON, dot(N, L));\n        vec3 H = normalize(L + V);\n        float NdotH = dot(N, H);\n        float VdotH = dot(V, H);\n        float Hu = dot(H, Tu);\n        float Hv = dot(H, Tv);\n        vec3 Hlocal = vec3(Hu, Hv, NdotH);\n#if defined(PRISMLAYERED)\n        float N2dotL = dot(N2, L);\n        float N2dotH = dot(N2, H);\n        vec3 Hlocal2 = vec3(Hu, Hv, N2dotH);\n#endif\n        vec3 brdf = lightColor[i] *\n#if defined(PRISMOPAQUE)\n            BRDF_Opaque(Hlocal, NdotL, NdotH, NdotV, VdotH,\n                    surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation,\n                    opaqueF0, opaqueAlbedo);\n#elif defined(PRISMMETAL)\n            BRDF_Metal(Hlocal, NdotL, NdotH, NdotV, VdotH,\n                surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation,\n                metalF0);\n#elif defined(PRISMLAYERED)\n            BRDF_Layered(Hlocal, NdotL, NdotH, NdotV, VdotH, Hlocal2, N2dotL, N2dotH, N2dotV,\n                surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation,\n                layeredF0, layeredDiffuse, layeredRoughness, layeredAnisotropy,\n                layeredRotation, bottom_f0, layeredFraction);\n#elif defined(PRISMTRANSPARENT)\n            BRDF_Transparent(Hlocal, NdotL, NdotH, NdotV, VdotH, surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation);\n#elif defined(PRISMGLAZING)\n            BRDF_Glazing(Hlocal, NdotL, NdotH, NdotV, VdotH, surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation,\n                         glazingF0, glazingTransmissionColor, glazingIlluminace);\n#elif defined(PRISMWOOD)\n            BRDF_Wood(Hlocal, NdotL, NdotH, NdotV, VdotH, surfaceAlbedo, surfaceRoughness, woodDiffuse);\n#endif\n        outRadianceLight += max(vec3(0.0), brdf);\n    }\n#endif\n    vec3 outRadianceEnv = vec3(0.0);\n#if defined( USE_ENVMAP )\n    outRadianceEnv =\n#if defined(PRISMOPAQUE)\n        Environment_Opaque(N, V, clamp(NdotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness,\n                opaqueF0, opaqueAlbedo, surfaceAnisotropy, surfaceRotation, Tu, Tv);\n#elif defined(PRISMMETAL)\n        Environment_Metal(N, V, clamp(NdotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness, metalF0, surfaceAnisotropy, surfaceRotation, Tu, Tv);\n#elif defined(PRISMLAYERED)\n        Environment_Layered(N, V, clamp(NdotV, 0.0, 1.0), N2, clamp(N2dotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness,\n            layeredF0, surfaceAnisotropy, surfaceRotation, Tu, Tv, layeredDiffuse, layeredRoughness, layeredAnisotropy,\n            layeredRotation, bottom_f0, layeredFraction);\n#elif defined(PRISMTRANSPARENT)\n        Environment_Transparent(N, V, clamp(NdotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation, Tu, Tv);\n#elif defined(PRISMGLAZING)\n        Environment_Glazing(N, V, clamp(NdotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness, surfaceAnisotropy, surfaceRotation, Tu, Tv,\n            glazingF0, transmissionF, transmissionAlpha, glazingAdjustedColor, glazingIlluminace);\n#elif defined(PRISMWOOD)\n        Environment_Wood(N, V, clamp(NdotV, 0.0, 1.0), surfaceAlbedo, surfaceRoughness, woodDiffuse, surfaceAnisotropy, surfaceRotation, Tu, Tv);\n#endif\n#endif\n#if defined(PRISMOPAQUE)\n    vec3 luminanceModifier;\n#prism_sample_texture<opaque_luminance_modifier, luminanceModifier, false, true>\n    outRadianceEnv += luminanceModifier * opaque_luminance;\n#endif\n    float surface_cutout = 1.0;\n#prism_sample_texture<surface_cutout, surface_cutout, true, false>\n#if defined( USE_SURFACE_CUTOUT_MAP )\n    if(surface_cutout < 0.01) discard;\n#endif\n    gl_FragColor = vec4( outRadianceLight + outRadianceEnv, opacity*surface_cutout );\n#if TONEMAP_OUTPUT == 1\n    gl_FragColor.xyz = toneMapCanonOGS_WithGamma_WithColorPerserving(exposureBias * gl_FragColor.xyz);\n#elif TONEMAP_OUTPUT == 2\n    gl_FragColor.xyz = toneMapCanonFilmic_WithGamma(exposureBias * gl_FragColor.xyz);\n#endif\n#ifdef USE_FOG\n    float depth = gl_FragCoord.z / gl_FragCoord.w;\n    float fogFactor = smoothstep( fogNear, fogFar, depth );\n    gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif\n#if defined(PRISMTRANSPARENT)\n    applyPrismTransparency(gl_FragColor, transparent_color, transparent_ior);\n    gl_FragColor.a *= surface_cutout;\n#ifdef USE_TILING\n    gl_FragColor.a *= v_TilingMap.a;\n#endif\n#elif defined( PRISMGLAZING )\n    applyPrismGlazingOpacity(gl_FragColor, transmissionF, transmissionAlpha, NdotV, glazingIlluminace);\n#ifdef USE_TILING\n    gl_FragColor.a *= v_TilingMap.a;\n#endif\n#endif\n#include<theming_frag>\n#include<final_frag>\n}\n";

/***/ }),

/***/ "./extensions/MaterialConverterPrism/shaders/prism_vert.glsl":
/*!*******************************************************************!*\
  !*** ./extensions/MaterialConverterPrism/shaders/prism_vert.glsl ***!
  \*******************************************************************/
/***/ ((module) => {

module.exports = "varying vec3 vViewPosition;\nvarying vec3 vNormal;\n#if defined(PRISMWOOD) && !defined(NO_UVW)\nvarying vec3 vUvw;\n#if defined(PRISMWOODBUMP)\nvarying vec3 vtNormal;\nvarying mat3 mNormalMatrix;\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || NUM_CUTPLANES > 0\nvarying vec3 vWorldPosition;\n#endif\n#prism_check<USE_MAP>\n#if defined(USE_MAP) || defined(USE_TILING)\nvarying vec2 vUv;\n#endif\n#ifdef MRT_NORMALS\nvarying float depth;\n#endif\n#include<pack_normals>\n#include<instancing_decl_vert>\n#include<id_decl_vert>\n#include<shadowmap_decl_vert>\n#if !defined(USE_MAP) && (MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0) || defined( PRISMWOODBUMP )\nvarying vec3 vTangent;\nvarying vec3 vBitangent;\nvoid ComputeTangents(vec3 normal, out vec3 u, out vec3 v)\n{\n    float scale = normal.z < 0.0 ? -1.0 : 1.0;\n    vec3 temp = scale * normal;\n    float e    = temp.z;\n    float h    = 1.0/(1.0 + e);\n    float hvx  = h   *  temp.y;\n    float hvxy = hvx * -temp.x;\n    u = vec3(e + hvx * temp.y, hvxy,                -temp.x);\n    v = vec3(hvxy,             e + h * temp.x * temp.x, -temp.y);\n    u *= scale;\n    v *= scale;\n}\n#endif\nvoid main() {\n#if defined(USE_MAP) || defined(USE_TILING)\n    vUv = uv;\n#endif\n#ifdef UNPACK_NORMALS\n    vec3 objectNormal = decodeNormal(normal);\n#else\n    vec3 objectNormal = normal;\n#endif\n#ifdef FLIP_SIDED\n    objectNormal = -objectNormal;\n#endif\n    objectNormal = getInstanceNormal(objectNormal);\n    vec3 instPos = getInstancePos(position);\n#if defined(PRISMWOOD) && !defined(NO_UVW)\n#if defined(PRISMWOODBUMP)\n    vUvw = instPos;\n    vtNormal = normalize(objectNormal);\n    mNormalMatrix = normalMatrix;\n#else\n    vUvw = uvw;\n#endif\n#endif\n    vec3 transformedNormal = normalMatrix * objectNormal;\n    vNormal = normalize( transformedNormal );\n    vec4 mvPosition = modelViewMatrix * vec4( instPos, 1.0 );\n    gl_Position = projectionMatrix * mvPosition;\n    vViewPosition = -mvPosition.xyz;\n#if MAX_SPOT_LIGHTS > 0 || NUM_CUTPLANES > 0\n    vec4 worldPosition = modelMatrix * vec4( instPos, 1.0 );\n    vWorldPosition = worldPosition.xyz;\n#endif\n#if !defined(USE_MAP) && (MAX_DIR_LIGHTS > 0 || MAX_POINT_LIGHTS > 0 || MAX_SPOT_LIGHTS > 0) || defined ( PRISMWOODBUMP )\n    vec3 Tu, Tv;\n#if defined(PRISMWOODBUMP)\n    ComputeTangents(vtNormal, Tu, Tv);\n#else\n    ComputeTangents(vNormal, Tu, Tv);\n#endif\n    vTangent = Tu;\n    vBitangent = Tv;\n#endif\n#ifdef MRT_NORMALS\n    depth = mvPosition.z;\n#endif\n#include<id_vert>\n#include<shadowmap_vert>\n}\n";

/***/ }),

/***/ "./extensions/MaterialConverterPrism/MSDF.js":
/*!***************************************************!*\
  !*** ./extensions/MaterialConverterPrism/MSDF.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MSDF_EDGE_COLOR_BLACK": () => (/* binding */ MSDF_EDGE_COLOR_BLACK),
/* harmony export */   "MSDF_EDGE_COLOR_RED": () => (/* binding */ MSDF_EDGE_COLOR_RED),
/* harmony export */   "MSDF_EDGE_COLOR_GREEN": () => (/* binding */ MSDF_EDGE_COLOR_GREEN),
/* harmony export */   "MSDF_EDGE_COLOR_YELLOW": () => (/* binding */ MSDF_EDGE_COLOR_YELLOW),
/* harmony export */   "MSDF_EDGE_COLOR_BLUE": () => (/* binding */ MSDF_EDGE_COLOR_BLUE),
/* harmony export */   "MSDF_EDGE_COLOR_MAGENTA": () => (/* binding */ MSDF_EDGE_COLOR_MAGENTA),
/* harmony export */   "MSDF_EDGE_COLOR_CYAN": () => (/* binding */ MSDF_EDGE_COLOR_CYAN),
/* harmony export */   "MSDF_EDGE_COLOR_WHITE": () => (/* binding */ MSDF_EDGE_COLOR_WHITE),
/* harmony export */   "MSDFShape": () => (/* binding */ MSDFShape),
/* harmony export */   "MSDFContour": () => (/* binding */ MSDFContour),
/* harmony export */   "MSDFLinearSegment": () => (/* binding */ MSDFLinearSegment)
/* harmony export */ });
// Helper class to generate MSDF, copied from https://github.com/Chlumsky/msdfgen
// AUTHOR: Virgil Dong, Eric Haines
//**************************************************************************/

// import * as THREE from "three";

var SIGNED_DISTANCE_INF = -1e240;

function SignedDistance() {
  this.distance = SIGNED_DISTANCE_INF;
  this.dot = 1;
}

SignedDistance.prototype = {

  constructor: SignedDistance,

  set: function set(distance, dot) {
    this.distance = distance;
    this.dot = dot;

    return this;
  },

  copy: function copy(sd) {
    this.distance = sd.distance;
    this.dot = sd.dot;
  },

  lessThan: function lessThan(sd) {
    return Math.abs(this.distance) < Math.abs(sd.distance) || Math.abs(this.distance) === Math.abs(sd.distance) && this.dot < sd.dot;
  },

  greaterThan: function greaterThan(sd) {
    return Math.abs(this.distance) > Math.abs(sd.distance) || Math.abs(this.distance) === Math.abs(sd.distance) && this.dot > sd.dot;
  },

  lessThanOrEquals: function lessThanOrEquals(sd) {
    return Math.abs(this.distance) < Math.abs(sd.distance) || Math.abs(this.distance) == Math.abs(sd.distance) && this.dot <= sd.dot;
  },

  greaterThanOrEquals: function greaterThanOrEquals(sd) {
    return Math.abs(this.distance) > Math.abs(sd.distance) || Math.abs(this.distance) == Math.abs(sd.distance) && this.dot >= sd.dot;
  } };



function cross2d(a, b) {
  return a.x * b.y - a.y * b.x;
}

function getOrthonormal(p, polarity, allowZero) {
  var len = p.length();
  if (len === 0)
  return polarity ? new THREE.Vector2(0.0, allowZero ? 0.0 : 1.0) : new THREE.Vector2(0.0, -(allowZero ? 0.0 : 1.0));
  return polarity ? new THREE.Vector2(-p.y / len, p.x / len) : new THREE.Vector2(p.y / len, -p.x / len);
}

var MSDF_EDGE_COLOR_BLACK = 0;
var MSDF_EDGE_COLOR_RED = 1;
var MSDF_EDGE_COLOR_GREEN = 2;
var MSDF_EDGE_COLOR_YELLOW = 3;
var MSDF_EDGE_COLOR_BLUE = 4;
var MSDF_EDGE_COLOR_MAGENTA = 5;
var MSDF_EDGE_COLOR_CYAN = 6;
var MSDF_EDGE_COLOR_WHITE = 7;


function MSDFLinearSegment(pt1, pt2, color) {

  this.p = [];
  this.p[0] = pt1.clone();
  this.p[1] = pt2.clone();
  this.color = color;

}

MSDFLinearSegment.prototype = {

  constructor: MSDFLinearSegment,

  set: function set(color) {
    this.color = color;

    return this;
  },

  clone: function clone() {

    return new this.constructor(this.p[0], this.p[1], this.color);

  },

  /// Returns the point on the edge specified by the parameter (between 0 and 1).
  point: function point(param) {
    return this.p[0].clone().lerp(this.p[1], param);
  },

  /// Returns the direction the edge.
  direction: function direction() {
    return this.p[1].clone().sub(this.p[0]);
  },

  /// Returns the minimum signed distance between origin and the edge.
  signedDistance: function signedDistance(origin) {
    var aq = origin.clone().sub(this.p[0]);
    var ab = this.direction();
    var param = aq.dot(ab) / ab.dot(ab);
    var eq = this.p[param > .5 ? 1 : 0].clone().sub(origin);
    var endpointDistance = eq.length();
    if (param > 0 && param < 1) {
      var orthoDistance = getOrthonormal(ab, false, false).dot(aq);
      if (Math.abs(orthoDistance) < endpointDistance) {
        var _sd = new SignedDistance();
        _sd.set(orthoDistance, 0);
        return [_sd, param];
      }
    }
    /// Returns 1 for non-negative values and -1 for negative values.
    var nzs = 2 * (cross2d(aq, ab) > 0 ? 1 : 0) - 1;
    var sd = new SignedDistance();
    sd.set(nzs * endpointDistance, Math.abs(ab.normalize().dot(eq.normalize(eq))));
    return [sd, param];
  },


  /// Converts a previously retrieved signed distance from origin to pseudo-distance.
  distanceToPseudoDistance: function distanceToPseudoDistance(sd, origin, param) {
    var pseudoDistance, dir, ts;
    if (param < 0) {
      dir = this.direction().normalize();
      var aq = origin.clone().sub(this.p[0]);
      ts = aq.dot(dir);
      if (ts < 0) {
        pseudoDistance = cross2d(aq, dir);
        if (Math.abs(pseudoDistance) <= Math.abs(sd.distance)) {
          sd.distance = pseudoDistance;
          sd.dot = 0;
        }
      }
    } else
    if (param > 1) {
      // note that this line is the same as above. In the original it is direction(0) vs. direction(1),
      // but for LinearSegment::direction the parameter 0 or 1 is ignored
      dir = this.direction().normalize();
      var bq = origin.clone().sub(this.p[1]);
      ts = bq.dot(dir);
      if (ts > 0) {
        pseudoDistance = cross2d(bq, dir);
        if (Math.abs(pseudoDistance) <= Math.abs(sd.distance)) {
          sd.distance = pseudoDistance;
          sd.dot = 0;
        }
      }
    }
  },

  /// Moves the start point of the edge segment.
  moveStartPoint: function moveStartPoint(to) {
    this.p[0].copy(to);
  },

  /// Moves the end point of the edge segment.
  moveEndPoint: function moveEndPoint(to) {
    this.p[1].copy(to);
  },

  /// Splits the edge segments into thirds which together represent the original edge.
  splitInThirds: function splitInThirds(part1, part2, part3) {
    // this could be made more efficient by saving the interpoa
    var oneThird = this.point(1 / 3.);
    var twoThirds = this.point(2 / 3.);
    part1 = new MSDFLinearSegment(this.p[0], oneThird, this.color);
    part2 = new MSDFLinearSegment(oneThird, twoThirds, this.color);
    part3 = new MSDFLinearSegment(twoThirds, this.p[1], this.color);
  } };





function shoelace(a, b) {
  return (b.x - a.x) * (a.y + b.y);
}

function sign(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}


function MSDFContour() {

  this.edges = [];

}

MSDFContour.prototype = {

  constructor: MSDFContour,

  addEdge: function addEdge(lineSeg) {

    this.edges.push(lineSeg);
  },

  /// Computes the bounding box of the contour.
  // never called, so not translated: void bounds(double &l, double &b, double &r, double &t) const;

  /// Computes the winding of the contour. Returns 1 if positive, -1 if negative, 0 if no edges
  winding: function winding() {

    if (this.edges.length === 0)
    return 0;

    var total = 0;
    var a, b, c, d;
    if (this.edges.length == 1) {
      a = new THREE.Vector2();
      b = new THREE.Vector2();
      c = new THREE.Vector2();
      a.copy(this.edges[0].point(0));
      b.copy(this.edges[0].point(1 / 3.));
      c.copy(this.edges[0].point(2 / 3.));
      total += shoelace(a, b);
      total += shoelace(b, c);
      total += shoelace(c, a);
    } else
    if (this.edges.length == 2) {
      a = new THREE.Vector2();
      b = new THREE.Vector2();
      c = new THREE.Vector2();
      d = new THREE.Vector2();
      a.copy(this.edges[0].point(0));
      b.copy(this.edges[0].point(.5));
      c.copy(this.edges[1].point(0));
      d.copy(this.edges[1].point(.5));
      total += shoelace(a, b);
      total += shoelace(b, c);
      total += shoelace(c, d);
      total += shoelace(d, a);
    } else
    {
      var prev = new THREE.Vector2();
      var cur = new THREE.Vector2();
      prev = this.edges[this.edges.length - 1].point(0);
      for (var ie = 0; ie < this.edges.length; ie++) {
        cur = this.edges[ie].point(0);
        total += shoelace(prev, cur);
        prev = cur;
      }
    }
    return sign(total);
  } };



// Is the shared vertex a corner? Inputs must be normalized.
function isCorner(aDir, bDir, crossThreshold) {
  // more than 90 degrees, or more than the cross threshold, in terms of the sign of the angle
  return aDir.dot(bDir) <= 0 || Math.abs(cross2d(aDir, bDir)) > crossThreshold;
}

function switchColor(color, seed) {
  return switchColorBanned(color, seed, MSDF_EDGE_COLOR_BLACK);
}
function switchColorBanned(color, seed, banned) {
  var combined = color & banned;
  if (combined == MSDF_EDGE_COLOR_RED || combined == MSDF_EDGE_COLOR_GREEN || combined == MSDF_EDGE_COLOR_BLUE) {
    color = combined ^ MSDF_EDGE_COLOR_WHITE;
    return [color, seed];
  }
  if (color == MSDF_EDGE_COLOR_BLACK || color == MSDF_EDGE_COLOR_WHITE) {
    var start = [MSDF_EDGE_COLOR_CYAN, MSDF_EDGE_COLOR_MAGENTA, MSDF_EDGE_COLOR_YELLOW];
    color = start[seed % 3];
    seed = Math.floor(seed / 3);
    return [color, seed];
  }
  var shifted = color << 1 + (seed & 1);
  color = (shifted | shifted >> 3) & MSDF_EDGE_COLOR_WHITE;
  seed >>= 1;
  return [color, seed];
}

function EdgePoint() {

  this.minDistance = new SignedDistance();
  this.nearEdge = null;
  this.nearParam = 0;

}

EdgePoint.prototype = {

  constructor: EdgePoint,

  clear: function clear() {
    // note that the SignedDistance is not cleared
    this.nearEdge = null;
    this.nearParam = 0;
  },

  copy: function copy(ep) {
    this.minDistance.copy(ep.minDistance);
    this.nearEdge = ep.nearEdge;
    this.nearParam = ep.nearParam;
  } };


function median(a, b, c) {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
}

function pointToEdgeDistance(origin, edge) {
  var a = edge.point(0);
  var b = edge.point(1);
  var q = origin;
  var aq = origin.clone().sub(a);
  var ab = b.clone().sub(a);
  var param = aq.dot(ab) / ab.dot(ab);

  if (param < 0)
  {
    return aq.length();
  } else
  if (param > 1)
  {
    return q.clone().sub(b).length();
  } else

  {
    return Math.abs(getOrthonormal(ab, false, false).dot(aq));
  }
}


function MSDFShape() {

  this.contours = [];
  this.windings = [];
  this.inverseYAxis = false; // TODOTODO might need to set to true for WebGL; right now MSDF itself ignores this value entirely, so an implementation of reversal code may be needed

}

//Object.defineProperties( MSDF.prototype, {} );

MSDFShape.prototype = {

  constructor: MSDFShape,

  /// Adds a contour.
  addContour: function addContour(contour) {
    this.contours.push(contour);
  },

  /// Adds a blank contour and returns its reference.
  addBlankContour: function addBlankContour() {
    // push and return
    var contour = new MSDFContour();
    this.contours.push(contour);
    return contour;
  },

  // once contours are defined, copy over windings from all contours
  initialize: function initialize() {
    for (var ic = 0; ic < this.contours.length; ++ic) {
      var contour = this.contours[ic];
      this.windings.push(contour.winding());
    }
  },

  /// Performs basic checks to determine if the object represents a valid shape.
  // not translated, as never called: bool validate() const;
  /// Computes the shape's bounding box.
  // not translated, as never called: void bounds(double &l, double &b, double &r, double &t) const;

  /// coloring edges
  edgeColoringSimple: function edgeColoringSimple(angleThreshold, seed) {
    var crossThreshold = Math.sin(angleThreshold);
    for (var ic = 0; ic < this.contours.length; ++ic) {
      // Identify corners
      var contour = this.contours[ic];
      var corners = [];
      if (contour.edges.length > 0) {
        var prevDirection = contour.edges[contour.edges.length - 1].direction(1);
        for (var ie = 0; ie < contour.edges.length; ++ie) {
          var edge = contour.edges[ie];
          if (isCorner(prevDirection.normalize(), edge.direction(0).normalize(), crossThreshold))
          corners.push(ie);
          prevDirection = edge.direction(1);
        }
      }

      // Smooth contour
      if (corners.length === 0) {
        for (var _ie = 0; _ie < contour.edges.length; ++_ie) {
          contour.edges[_ie].color = MSDF_EDGE_COLOR_WHITE;
        }
        // "Teardrop" case
      } else
      if (corners.length == 1) {
        var colors = [MSDF_EDGE_COLOR_WHITE, MSDF_EDGE_COLOR_WHITE];
        var results = switchColor(colors[0], seed);
        colors[0] = results[0];seed = results[1];
        colors[2] = colors[0];
        results = switchColor(colors[0], seed);
        colors[0] = results[0];seed = results[1];
        var corner = corners[0];
        if (contour.edges.length >= 3) {
          var m = contour.edges.length;
          // this equation basically gives 0,1,2 for indices, spread fairly equally across the range.
          for (var i = 0; i < m; ++i) {
            // original was:
            // (colors + 1)[int(3 + 2.875*i / (m - 1) - 1.4375 + .5) - 3];
            // This uses a trick that when i > -1.0 it will round to 0. The intent is to give
            // for, say, m=6 a range 1,1,1,1,2,2
            // Simplification:
            // colors[int(4 + 2.875*i / (m - 1) - 1.4375 + .5) - 3];
            // colors[int(1 + 2.875*i / (m - 1) - 0.9375)];
            // colors[int(2.875*i / (m - 1) + 0.0625)];
            // Verified my fix was OK with the author: https://github.com/Chlumsky/msdfgen/issues/62
            contour.edges[(corner + i) % m].color = colors[Math.floor(2.875 * i / (m - 1) + 0.0625)];
          }
        } else
        if (contour.edges.length >= 1) {
          // Less than three edge segments for three colors => edges must be split
          var parts = [];
          contour.edges[0].splitInThirds(parts[0 + 3 * corner], parts[1 + 3 * corner], parts[2 + 3 * corner]);
          if (contour.edges.length >= 2) {
            contour.edges[1].splitInThirds(parts[3 - 3 * corner], parts[4 - 3 * corner], parts[5 - 3 * corner]);
            parts[0].color = parts[1].color = colors[0];
            parts[2].color = parts[3].color = colors[1];
            parts[4].color = parts[5].color = colors[2];
          } else
          {
            parts[0].color = colors[0];
            parts[1].color = colors[1];
            parts[2].color = colors[2];
          }
          contour.edges.clear();
          for (var _i = 0; _i < parts.length; ++_i) {
            contour.edges.push(parts[_i]);}
        }
      }
      // Multiple corners
      else {
          var cornerCount = corners.length;
          var spline = 0;
          var start = corners[0];
          var _m = contour.edges.length;
          var color = MSDF_EDGE_COLOR_WHITE;
          var _results = switchColor(color, seed);
          color = _results[0];seed = _results[1];
          var initialColor = color;
          for (var _i2 = 0; _i2 < _m; ++_i2) {
            var index = (start + _i2) % _m;
            if (spline + 1 < cornerCount && corners[spline + 1] == index) {
              ++spline;
              _results = switchColorBanned(color, seed, (spline === cornerCount - 1 ? 1 : 0) * initialColor);
              color = _results[0];seed = _results[1];
            }
            contour.edges[index].color = color;
          }
        }
    }
  },

  /// calculate msdf value for point p
  calculateMSDFValue: function calculateMSDFValue(p) {
    var contourCount = this.contours.length;
    var contourSD = [];

    var sr = new EdgePoint();
    var sg = new EdgePoint();
    var sb = new EdgePoint();
    var d = Math.abs(SIGNED_DISTANCE_INF);
    var negDist = -SIGNED_DISTANCE_INF;
    var posDist = SIGNED_DISTANCE_INF;
    var winding = 0;

    var r = new EdgePoint();
    var g = new EdgePoint();
    var b = new EdgePoint();
    for (var i = 0; i < this.contours.length; ++i) {
      contourSD[i] = { // MultiDistance
        r: SIGNED_DISTANCE_INF,
        g: SIGNED_DISTANCE_INF,
        b: SIGNED_DISTANCE_INF,
        med: SIGNED_DISTANCE_INF };

      var contour = this.contours[i];
      r.clear();
      g.clear();
      b.clear();

      for (var ie = 0; ie < contour.edges.length; ++ie) {
        var edge = contour.edges[ie];
        var resultArray = edge.signedDistance(p);
        var distance = resultArray[0];
        var param = resultArray[1];
        if ((edge.color & MSDF_EDGE_COLOR_RED) > 0 && distance.lessThan(r.minDistance)) {
          r.minDistance.copy(distance);
          r.nearEdge = edge;
          r.nearParam = param;
        }
        if ((edge.color & MSDF_EDGE_COLOR_GREEN) > 0 && distance.lessThan(g.minDistance)) {
          g.minDistance.copy(distance);
          g.nearEdge = edge;
          g.nearParam = param;
        }
        if ((edge.color & MSDF_EDGE_COLOR_BLUE) > 0 && distance.lessThan(b.minDistance)) {
          b.minDistance.copy(distance);
          b.nearEdge = edge;
          b.nearParam = param;
        }
      }
      if (r.minDistance.lessThan(sr.minDistance))
      sr.copy(r);
      if (g.minDistance.lessThan(sg.minDistance))
      sg.copy(g);
      if (b.minDistance.lessThan(sb.minDistance))
      sb.copy(b);

      var medMinDistance = Math.abs(median(r.minDistance.distance, g.minDistance.distance, b.minDistance.distance));
      if (medMinDistance < d) {
        d = medMinDistance;
        winding = -this.windings[i];
      }
      if (r.nearEdge)
      r.nearEdge.distanceToPseudoDistance(r.minDistance, p, r.nearParam);
      if (g.nearEdge)
      g.nearEdge.distanceToPseudoDistance(g.minDistance, p, g.nearParam);
      if (b.nearEdge)
      b.nearEdge.distanceToPseudoDistance(b.minDistance, p, b.nearParam);
      medMinDistance = median(r.minDistance.distance, g.minDistance.distance, b.minDistance.distance);
      contourSD[i].r = r.minDistance.distance;
      contourSD[i].g = g.minDistance.distance;
      contourSD[i].b = b.minDistance.distance;
      contourSD[i].med = medMinDistance;
      if (this.windings[i] > 0 && medMinDistance >= 0 && Math.abs(medMinDistance) < Math.abs(posDist))
      posDist = medMinDistance;
      if (this.windings[i] < 0 && medMinDistance <= 0 && Math.abs(medMinDistance) < Math.abs(negDist))
      negDist = medMinDistance;
    }
    if (sr.nearEdge)
    sr.nearEdge.distanceToPseudoDistance(sr.minDistance, p, sr.nearParam);
    if (sg.nearEdge)
    sg.nearEdge.distanceToPseudoDistance(sg.minDistance, p, sg.nearParam);
    if (sb.nearEdge)
    sb.nearEdge.distanceToPseudoDistance(sb.minDistance, p, sb.nearParam);

    // MultiDistance class
    var msd = {
      r: SIGNED_DISTANCE_INF,
      g: SIGNED_DISTANCE_INF,
      b: SIGNED_DISTANCE_INF,
      med: SIGNED_DISTANCE_INF };

    if (posDist >= 0 && Math.abs(posDist) <= Math.abs(negDist)) {
      msd.med = SIGNED_DISTANCE_INF;
      winding = 1;
      for (var _i3 = 0; _i3 < contourCount; ++_i3) {
        if (this.windings[_i3] > 0 && contourSD[_i3].med > msd.med && Math.abs(contourSD[_i3].med) < Math.abs(negDist))
        msd = contourSD[_i3];}
    } else
    if (negDist <= 0 && Math.abs(negDist) <= Math.abs(posDist)) {
      msd.med = -SIGNED_DISTANCE_INF;
      winding = -1;
      for (var _i4 = 0; _i4 < contourCount; ++_i4) {
        if (this.windings[_i4] < 0 && contourSD[_i4].med < msd.med && Math.abs(contourSD[_i4].med) < Math.abs(posDist))
        msd = contourSD[_i4];}
    }
    for (var _i5 = 0; _i5 < contourCount; ++_i5) {
      if (this.windings[_i5] != winding && Math.abs(contourSD[_i5].med) < Math.abs(msd.med)) {
        // note that we "cheat" here, vs. the original code, which copies the values. This is not
        // needed as msd gets used at the end, and it and the contourSD is discarded.
        msd = contourSD[_i5];
      }
    }
    if (median(sr.minDistance.distance, sg.minDistance.distance, sb.minDistance.distance) == msd.med) {
      msd.r = sr.minDistance.distance;
      msd.g = sg.minDistance.distance;
      msd.b = sb.minDistance.distance;
    }

    return new THREE.Vector3(msd.r, msd.g, msd.b);
  },

  /// calculate minium distance between edges that colored same color
  minSameColoredEdgeDistance: function minSameColoredEdgeDistance() {
    // all edges are colored by 3 colors in all.
    var minDistance = [1e10, 1e10, 1e10];
    for (var ic = 0; ic < this.contours.length; ++ic) {
      var contour = this.contours[ic];
      for (var i = 0; i < contour.edges.length; ++i) {
        var edge = contour.edges[i];
        // neighbor edges would not colored by same color, so inner loop ends at i-1
        for (var j = 0; j + 1 < i; ++j)
        {
          var otherEdge = contour.edges[j];
          if (edge.color == otherEdge.color)
          {
            // as the MSDF algorithm would fail on self-intersected polygon, we only can
            // simply assume all same colored edges are not intersected here. In this
            // case, the minimun distance between two edges are the min distance of end
            // points to the other edge.
            var dist = Math.min(
            Math.min(pointToEdgeDistance(edge.point(0), otherEdge),
            pointToEdgeDistance(edge.point(1), otherEdge)),
            Math.min(pointToEdgeDistance(otherEdge.point(0), edge),
            pointToEdgeDistance(otherEdge.point(1), edge)));


            var idx = edge.color - MSDF_EDGE_COLOR_MAGENTA;
            minDistance[idx] = Math.min(minDistance[idx], dist);
          }
        }
      }
    }
    return Math.min(Math.min(minDistance[0], minDistance[1]), minDistance[2]);
  } };



// not translated, as never called: void MsdfErrorCorrection(unsigned char*output, int width, int height, int bytesPerPixel, const OGS::float2 &threshold);



/***/ }),

/***/ "./extensions/MaterialConverterPrism/MaterialConverterPrism.js":
/*!*********************************************************************!*\
  !*** ./extensions/MaterialConverterPrism/MaterialConverterPrism.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "materialTilingPattern": () => (/* binding */ materialTilingPattern),
/* harmony export */   "swapPrismWoodTextures": () => (/* binding */ swapPrismWoodTextures),
/* harmony export */   "disposePrismWoodTextures": () => (/* binding */ disposePrismWoodTextures),
/* harmony export */   "convertPrismTexture": () => (/* binding */ convertPrismTexture),
/* harmony export */   "convertPrismMaterial": () => (/* binding */ convertPrismMaterial)
/* harmony export */ });
/* harmony import */ var _PrismShader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PrismShader */ "./extensions/MaterialConverterPrism/PrismShader.js");
/* harmony import */ var _MSDF__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MSDF */ "./extensions/MaterialConverterPrism/MSDF.js");

var _Autodesk$Viewing$Pri =

Autodesk.Viewing.Private.MaterialConverterCommon,parseMaterialGeneric = _Autodesk$Viewing$Pri.parseMaterialGeneric,parseMaterialColor = _Autodesk$Viewing$Pri.parseMaterialColor,parseMaterialScalar = _Autodesk$Viewing$Pri.parseMaterialScalar,SRGBToLinear = _Autodesk$Viewing$Pri.SRGBToLinear;

// TODO, since web doesn't use AdCoreUnits dependencies, only 9 units are supported in web now. (2020-02-06: and, apparently, for EVER)
var UnitPerMeter = {
  MilliMeter: 1000, mm: 1000, 8206: 1000,
  DeciMeter: 10, dm: 10, 8204: 10,
  CentiMeter: 100, cm: 100, 8205: 100,
  Meter: 1, m: 1, 8193: 1,
  KiloMeter: 0.001, km: 0.001, 8201: 0.001,
  Inch: 39.37008, in: 39.37008, 8214: 39.37008,
  Foot: 3.28084, ft: 3.28084, 8215: 3.28084,
  Mile: 0.00062137, mi: 0.00062137, 8225: 0.00062137,
  Yard: 1.09361, yard: 1.09361, 8221: 1.09361 };


// Convert meter to the new unit.
function ConvertDistance(distance, currentUnit, newUnit) {

  var factor = UnitPerMeter[newUnit];
  if (!factor) {
    factor = 1;
    console.warn('Unsupported unit: ' + newUnit);
  }

  var divisor = UnitPerMeter[currentUnit];
  if (!divisor) {
    divisor = 1;
    console.warn('Unsupported unit: ' + currentUnit);
  }

  return distance * factor / divisor;
}

function parseMaterialScalarWithSceneUnit(props, name, sceneUnit, undefVal) {
  if (!props || !props["scalars"])
  return undefVal;

  var vobj = props["scalars"][name];
  if (!vobj)
  return undefVal;

  return ConvertDistance(vobj["values"][0], vobj["units"], sceneUnit);
}

function parseMaterialGenericConnection(props, category, name, undefVal) {
  if (!props || !props[category])
  return undefVal;

  var vobj = props[category][name];
  if (!vobj)
  return undefVal;

  var connections = vobj["connections"];
  if (!connections)
  return undefVal;

  return vobj["connections"][0];
}


function parseWoodProfile(props, category, name) {
  //Init a default object.
  var ret = {
    bands: 0,
    weights: new THREE.Vector4(1, 1, 1, 1),
    frequencies: new THREE.Vector4(1, 1, 1, 1) };


  if (!props || !props[category])
  return ret;

  var vobj = props[category][name];
  if (!vobj || !vobj.values || !(vobj.values instanceof Array))
  return ret;

  var values = vobj.values;
  ret.bands = values.length / 2;
  for (var i = 0; i < ret.bands; ++i) {
    // Note that the frequencies stored in the material are actually used in the shader as 1/frequency.
    // We perform this computation once here and store these reciprocals, for efficiency.
    ret.frequencies.setComponent(i, 1 / values[2 * i]);
    ret.weights.setComponent(i, values[2 * i + 1]);
  }

  return ret;
}

function GetBumpScale(props, type, sceneUnit) {
  if (type === 0) {
    var depth = parseMaterialScalarWithSceneUnit(props, "bumpmap_Depth", sceneUnit, 0);

    var scale_x = 1;
    var scale_y = 1;
    if (parseMaterialGeneric(props, "scalars", "texture_RealWorldScale") != null) {
      scale_x = scale_y = parseMaterialScalarWithSceneUnit(props, "texture_RealWorldScale", sceneUnit, 1);
    } else
    {
      scale_x = parseMaterialScalarWithSceneUnit(props, "texture_RealWorldScaleX", sceneUnit, 1);
      scale_y = parseMaterialScalarWithSceneUnit(props, "texture_RealWorldScaleY", sceneUnit, 1);
    }
    scale_x = scale_x === 0 ? 1 : 1 / scale_x;
    scale_y = scale_y === 0 ? 1 : 1 / scale_y;

    return new THREE.Vector2(scale_x * depth, scale_y * depth);
  } else
  {
    var normalScale = parseMaterialGeneric(props, "scalars", "bumpmap_NormalScale", 1);
    return new THREE.Vector2(normalScale, normalScale);
  }
}

function Get2DPrismMapTransform(props, sceneUnit) {

  var worldOffsetX = parseMaterialScalarWithSceneUnit(props, "texture_RealWorldOffsetX", sceneUnit, 0);
  var worldOffsetY = parseMaterialScalarWithSceneUnit(props, "texture_RealWorldOffsetY", sceneUnit, 0);

  var texOffsetU = parseMaterialGeneric(props, "scalars", "texture_UOffset", 0);
  var texOffsetV = parseMaterialGeneric(props, "scalars", "texture_VOffset", 0);

  // Get the real-world size, i.e. the size of the map in a real unit, and use the reciprocal as
  // the scale.  If the scale is zero, use one instead.
  var worldScaleX = 1;
  var worldScaleY = 1;
  if (parseMaterialGeneric(props, "scalars", "texture_RealWorldScale") != null) {
    worldScaleX = worldScaleY = parseMaterialScalarWithSceneUnit(props, "texture_RealWorldScale", sceneUnit, 1);
  } else
  {
    worldScaleX = parseMaterialScalarWithSceneUnit(props, "texture_RealWorldScaleX", sceneUnit, 1);
    worldScaleY = parseMaterialScalarWithSceneUnit(props, "texture_RealWorldScaleY", sceneUnit, 1);
  }
  worldScaleX = worldScaleX === 0 ? 1 : worldScaleX;
  worldScaleY = worldScaleY === 0 ? 1 : worldScaleY;

  // include the additional U and V scales
  var texScaleU = parseMaterialGeneric(props, "scalars", "texture_UScale", 1);
  var texScaleV = parseMaterialGeneric(props, "scalars", "texture_VScale", 1);

  // Get the rotation angle and convert it from degrees to radians.
  var angle = parseMaterialGeneric(props, "scalars", "texture_WAngle", 0);
  angle *= Math.PI / 180.0;

  // Compute the final 3x3 matrix by combining the following transformations:
  // 1. inverse of the real world offset
  // 2. inverse of the real world scale
  // 3. uv scale
  // 4. uv rotation
  // 5. uv offset
  var c = Math.cos(angle),s = Math.sin(angle);
  var cx = texScaleU / worldScaleX,cy = texScaleV / worldScaleY;
  var matrix = {
    elements: [
    c * cx, s * cx, 0,
    -s * cy, c * cy, 0,
    -c * cx * worldOffsetX + s * cy * worldOffsetY + texOffsetU, -s * cx * worldOffsetX - c * cy * worldOffsetY + texOffsetV, 1] };



  return matrix;
}

var PrismImportantSamplingTexture;
function InitPrismImportantSamplingTextures() {
  //random number texture for prism important sampling.
  //We can reuse 3d wood noise texture, but to align with Fusion,
  //use the same random number texture.
  var randomNum = [
  0, 128, 64, 191, 32, 160, 96, 223,
  16, 143, 80, 207, 48, 175, 112, 239,
  8, 135, 72, 199, 40, 167, 103, 231,
  25, 151, 88, 215, 56, 183, 120, 250];


  var randomNumBuffer = new Uint8Array(randomNum);
  var randomNumTex = new THREE.DataTexture(randomNumBuffer, 32, 1,
  THREE.LuminanceFormat,
  THREE.UnsignedByteType,
  THREE.UVMapping,
  THREE.RepeatWrapping, THREE.RepeatWrapping,
  THREE.NearestFilter, THREE.NearestFilter, 0);
  randomNumTex.generateMipmaps = false;
  randomNumTex.flipY = false;
  randomNumTex.needsUpdate = true;

  var areaElement = function areaElement(x, y) {
    return Math.atan2(x * y, Math.sqrt(x * x + y * y + 1.0));
  };

  //Calculate the solid angle, so we don't need to do this in the shader.
  /// http://www.mpia-hd.mpg.de/~mathar/public/mathar20051002.pdf
  /// http://www.rorydriscoll.com/2012/01/15/cubemap-texel-solid-angle/
  var solidAngleBuffer = new Uint8Array(128 * 128);
  var u, v;
  var invFaceSize = 1.0 / 128.0;
  for (var i = 0; i < 128; ++i) {
    for (var j = 0; j < 128; ++j) {
      u = i / 128.0 * 2.0 - 1.0;
      v = j / 128.0 * 2.0 - 1.0;
      u = Math.min(Math.max(-1.0 + invFaceSize, u), 1.0 - invFaceSize);
      v = Math.min(Math.max(-1.0 + invFaceSize, v), 1.0 - invFaceSize);

      var x0 = u - invFaceSize;
      var x1 = u + invFaceSize;
      var y0 = v - invFaceSize;
      var y1 = v + invFaceSize;

      // Compute solid angle of texel area.
      var solidAngle = areaElement(x1, y1) -
      areaElement(x0, y1) -
      areaElement(x1, y0) +
      areaElement(x0, y0);
      //The max result is 0.000244125724. Map to [0, 255]
      solidAngleBuffer[i * 128 + j] = solidAngle * 1000000;
    }
  }

  var solidAngleTex = new THREE.DataTexture(solidAngleBuffer, 128, 128,
  THREE.LuminanceFormat,
  THREE.UnsignedByteType,
  THREE.UVMapping,
  THREE.RepeatWrapping, THREE.RepeatWrapping,
  THREE.NearestFilter, THREE.NearestFilter, 0);
  solidAngleTex.generateMipmaps = false;
  solidAngleTex.flipY = false;
  solidAngleTex.needsUpdate = true;

  PrismImportantSamplingTexture = {
    randomNum: randomNumTex,
    solidAngle: solidAngleTex };

}

var PrismWoodTexture;
//Init the prism wood textures. They are used in all prism 3d wood materials, so keep them
//in the material manager.
function InitPrism3DWoodTextures() {
  var permutation = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
  140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
  247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
  57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
  74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
  60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
  65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
  200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
  52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
  207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
  119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
  129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
  218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
  81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
  184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
  222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

  var permutationBuffer = new Uint8Array(permutation);
  var permutationTex = new THREE.DataTexture(permutationBuffer, 256, 1,
  THREE.LuminanceFormat,
  THREE.UnsignedByteType,
  THREE.UVMapping,
  THREE.RepeatWrapping, THREE.RepeatWrapping,
  THREE.NearestFilter, THREE.NearestFilter, 0);
  permutationTex.generateMipmaps = false;
  permutationTex.flipY = false;
  permutationTex.needsUpdate = true;
  //This is different with OGS desktop. OGS uses a float texture. I map these number to
  //unsight byte, since some platform may not support float texture. Test result shows that
  //the pixel diffrence is very small.
  var gradientData = [
  225, 39, 122, 231, 29, 173, 15, 159, 75, 88, 233, 19, 179, 79, 72, 94,
  54, 73, 151, 161, 171, 113, 221, 144, 127, 83, 168, 19, 88, 122, 62, 225,
  109, 128, 246, 247, 172, 101, 61, 139, 211, 168, 64, 210, 224, 82, 87, 97,
  119, 250, 201, 44, 242, 239, 154, 99, 126, 13, 44, 70, 246, 170, 100, 52,
  135, 28, 187, 22, 207, 119, 199, 1, 235, 187, 55, 131, 190, 124, 222, 249,
  236, 53, 225, 231, 71, 30, 173, 185, 153, 47, 79, 133, 225, 10, 140, 62,
  17, 99, 100, 29, 137, 95, 142, 244, 76, 5, 83, 124, 38, 216, 253, 195,
  44, 210, 148, 185, 188, 39, 78, 195, 132, 30, 60, 73, 92, 223, 133, 80,
  230, 56, 118, 207, 79, 15, 251, 211, 111, 21, 79, 23, 240, 146, 150, 207,
  3, 61, 103, 27, 148, 6, 31, 127, 235, 58, 173, 244, 116, 81, 34, 120,
  192, 213, 188, 226, 97, 23, 16, 161, 106, 80, 242, 148, 35, 37, 91, 117,
  51, 216, 97, 193, 126, 222, 39, 38, 133, 217, 215, 23, 237, 57, 205, 42,
  222, 165, 126, 133, 33, 8, 227, 154, 27, 18, 56, 11, 192, 120, 80, 92,
  236, 38, 210, 207, 128, 31, 135, 39, 123, 5, 49, 127, 107, 200, 34, 14,
  153, 239, 134, 19, 248, 162, 58, 201, 159, 198, 243, 158, 72, 5, 138, 184,
  222, 200, 34, 141, 233, 40, 195, 238, 191, 122, 171, 32, 66, 254, 229, 197];

  var gradientBuffer = new Uint8Array(gradientData);
  var gradientTex = new THREE.DataTexture(gradientBuffer, 256, 1,
  THREE.LuminanceFormat,
  THREE.UnsignedByteType,
  THREE.UVMapping,
  THREE.RepeatWrapping, THREE.RepeatWrapping,
  THREE.NearestFilter, THREE.NearestFilter, 0);

  gradientTex.generateMipmaps = false;
  gradientTex.flipY = false;
  gradientTex.needsUpdate = true;

  var perm = function perm(x) {
    return permutation[x % 256];
  };

  var perm2D = new Array(256 * 256 * 4);
  var A, AA, AB, B, BA, BB, index, x;
  for (var y = 0; y < 256; ++y) {
    for (x = 0; x < 256; ++x) {
      A = perm(x) + y;
      AA = perm(A);
      AB = perm(A + 1);
      B = perm(x + 1) + y;
      BA = perm(B);
      BB = perm(B + 1);

      // Store (AA, AB, BA, BB) in pixel (x,y)
      index = 4 * (y * 256 + x);
      perm2D[index] = AA;
      perm2D[index + 1] = AB;
      perm2D[index + 2] = BA;
      perm2D[index + 3] = BB;
    }}
  var perm2DBuffer = new Uint8Array(perm2D);
  var perm2DTex = new THREE.DataTexture(perm2DBuffer, 256, 256,
  THREE.RGBAFormat,
  THREE.UnsignedByteType,
  THREE.UVMapping,
  THREE.RepeatWrapping, THREE.RepeatWrapping,
  THREE.NearestFilter, THREE.NearestFilter, 0);
  perm2DTex.generateMipmaps = false;
  perm2DTex.flipY = false;
  perm2DTex.needsUpdate = true;

  var gradients3D = [
  1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
  1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
  0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  1, 1, 0, 0, -1, 1, -1, 1, 0, 0, -1, -1];

  var permGrad = new Array(1024);
  for (x = 0; x < 256; ++x) {
    var i = permutation[x] % 16;
    // Convert the gradient to signed-normalized int.
    permGrad[x * 4] = gradients3D[i * 3] * 127 + 128;
    permGrad[x * 4 + 1] = gradients3D[i * 3 + 1] * 127 + 128;
    permGrad[x * 4 + 2] = gradients3D[i * 3 + 2] * 127 + 128;
    permGrad[x * 4 + 3] = 0;
  }
  var permGradBuffer = new Uint8Array(permGrad);
  var permGradTex = new THREE.DataTexture(permGradBuffer, 256, 1,
  THREE.RGBAFormat,
  THREE.UnsignedByteType,
  THREE.UVMapping,
  THREE.RepeatWrapping, THREE.RepeatWrapping,
  THREE.NearestFilter, THREE.NearestFilter, 0);
  permGradTex.generateMipmaps = false;
  permGradTex.flipY = false;
  permGradTex.needsUpdate = true;

  PrismWoodTexture = {
    permutation: permutationTex,
    gradient: gradientTex,
    perm2D: perm2DTex,
    permGrad: permGradTex };

}

function swapPrismWoodTextures(newTex) {
  var oldTex = PrismWoodTexture;
  PrismWoodTexture = newTex;
  return oldTex;
}

function disposePrismWoodTextures(textures) {
  if (textures) {
    textures.permutation.dispose();
    textures.gradient.dispose();
    textures.perm2D.dispose();
    textures.permGrad.dispose();
  }
}

function parseWoodMap(tm, props, name) {
  tm[name + "_enable"] = parseMaterialGeneric(props, "booleans", name + "_enable", 0);
  var prof = parseWoodProfile(props, "scalars", name + "_prof");
  tm[name + "_bands"] = prof.bands;
  tm[name + "_weights"] = prof.weights;
  tm[name + "_frequencies"] = prof.frequencies;
}



function convertPrismMaterial(matObj, sceneUnit, tm, index) {

  index = index || matObj["userassets"];
  var innerMats = matObj["materials"];
  var innerMat = innerMats[index];

  if (innerMat) {
    var definition = innerMat['definition'];
    // if this is a tiling, need to get the real grout material
    if (definition === 'TilingPattern') {
      // if first "material" is a tiling pattern, look at the grout material, which must always exist.
      var idx = innerMat.properties.references.grout_material.connections[0];
      innerMat = innerMats[idx];
    }
  }

  var props = innerMat["properties"];

  if (!tm) {
    tm = (0,_PrismShader__WEBPACK_IMPORTED_MODULE_0__.createPrismMaterial)();
  } else if (!tm.isPrismMaterial) {
    return null;
  } else {
    tm.needsUpdate = true;
  }

  var map, texProps;
  tm.proteinMat = matObj;
  tm.proteinCategories = innerMat.categories;
  tm.packedNormals = true;

  tm.tag = innerMat["tag"];
  tm.prismType = innerMat["definition"];
  if (tm.prismType === undefined)
  tm.prismType = "";

  // check for the new IsSingleSided tag from ATF. Note that we assume all objects are
  // single-sided (tm.side == THREE.FrontSide) unless tagged otherwise.
  if (matObj.IsSingleSided !== undefined && matObj.IsSingleSided === false)
  tm.side = THREE.DoubleSide;
  // else, by default, tm.side is FrontSide

  var mapList = tm.mapList;

  tm.transparent = false;
  tm.envExponentMin = 1.0;
  tm.envExponentMax = 512.0;
  tm.envExponentCount = 10.0;

  // among other things, set up mapList and note what map, if any, is attached to each property such as "surface_albedo".
  tm.surface_albedo = SRGBToLinear(parseMaterialColor(props, "surface_albedo", new THREE.Color(1, 0, 0)));
  mapList.surface_albedo_map = parseMaterialGenericConnection(props, "colors", "surface_albedo", null);

  tm.surface_anisotropy = parseMaterialGeneric(props, "scalars", "surface_anisotropy", 0);
  mapList.surface_anisotropy_map = parseMaterialGenericConnection(props, "scalars", "surface_anisotropy", null);

  tm.surface_rotation = parseMaterialGeneric(props, "scalars", "surface_rotation", 0);
  mapList.surface_rotation_map = parseMaterialGenericConnection(props, "scalars", "surface_rotation", null);

  tm.surface_roughness = parseMaterialGeneric(props, "scalars", "surface_roughness", 0);
  mapList.surface_roughness_map = parseMaterialGenericConnection(props, "scalars", "surface_roughness", null);

  mapList.surface_cutout_map = parseMaterialGenericConnection(props, "textures", "surface_cutout", null);
  mapList.surface_normal_map = parseMaterialGenericConnection(props, "textures", "surface_normal", null);

  // if there is a cutout map, we must make the surface double-sided since we can see through to the inside
  if (mapList.surface_cutout_map != null) {
    tm.side = THREE.DoubleSide;
    tm.transparent = true;
  }

  switch (tm.prismType) {
    case 'PrismOpaque':
      tm.opaque_albedo = SRGBToLinear(parseMaterialColor(props, "opaque_albedo", new THREE.Color(1, 0, 0)));
      mapList.opaque_albedo_map = parseMaterialGenericConnection(props, "colors", "opaque_albedo", null);

      tm.opaque_luminance_modifier = SRGBToLinear(parseMaterialColor(props, "opaque_luminance_modifier", new THREE.Color(0, 0, 0)));
      mapList.opaque_luminance_modifier_map = parseMaterialGenericConnection(props, "colors", "opaque_luminance_modifier", null);

      tm.opaque_f0 = parseMaterialGeneric(props, "scalars", "opaque_f0", 0);
      mapList.opaque_f0_map = parseMaterialGenericConnection(props, "scalars", "opaque_f0", null);

      tm.opaque_luminance = parseMaterialGeneric(props, "scalars", "opaque_luminance", 0);

      break;
    case 'PrismMetal':
      tm.metal_f0 = SRGBToLinear(parseMaterialColor(props, "metal_f0", new THREE.Color(1, 0, 0)));
      mapList.metal_f0_map = parseMaterialGenericConnection(props, "colors", "metal_f0", null);

      break;
    case 'PrismLayered':
      tm.layered_bottom_f0 = SRGBToLinear(parseMaterialColor(props, "layered_bottom_f0", new THREE.Color(1, 1, 1)));
      mapList.layered_bottom_f0_map = parseMaterialGenericConnection(props, "colors", "layered_bottom_f0", null);

      tm.layered_diffuse = SRGBToLinear(parseMaterialColor(props, "layered_diffuse", new THREE.Color(1, 0, 0)));
      mapList.layered_diffuse_map = parseMaterialGenericConnection(props, "colors", "layered_diffuse", null);

      tm.layered_anisotropy = parseMaterialGeneric(props, "scalars", "layered_anisotropy", 0);
      mapList.layered_anisotropy_map = parseMaterialGenericConnection(props, "scalars", "layered_anisotropy", null);

      tm.layered_f0 = parseMaterialGeneric(props, "scalars", "layered_f0", 0);
      mapList.layered_f0_map = parseMaterialGenericConnection(props, "scalars", "layered_f0", null);

      tm.layered_fraction = parseMaterialGeneric(props, "scalars", "layered_fraction", 0);
      mapList.layered_fraction_map = parseMaterialGenericConnection(props, "scalars", "layered_fraction", null);

      tm.layered_rotation = parseMaterialGeneric(props, "scalars", "layered_rotation", 0);
      mapList.layered_rotation_map = parseMaterialGenericConnection(props, "scalars", "layered_rotation", null);

      tm.layered_roughness = parseMaterialGeneric(props, "scalars", "layered_roughness", 0);
      mapList.layered_roughness_map = parseMaterialGenericConnection(props, "scalars", "layered_roughness", null);

      mapList.layered_normal_map = parseMaterialGenericConnection(props, "textures", "layered_normal", null);

      break;
    case 'PrismTransparent':
      tm.transparent_color = SRGBToLinear(parseMaterialColor(props, "transparent_color", new THREE.Color(1, 0, 0)));

      tm.transparent_distance = parseMaterialGeneric(props, "scalars", "transparent_distance", 0);

      tm.transparent_ior = parseMaterialGeneric(props, "scalars", "transparent_ior", 0);

      tm.transparent = true;

      break;

    case 'PrismGlazing':
      tm.glazing_f0 = SRGBToLinear(parseMaterialColor(props, "glazing_f0", new THREE.Color(1, 1, 1)));
      mapList.glazing_f0_map = parseMaterialGenericConnection(props, "colors", "glazing_f0", null);

      tm.glazing_transmission_color = SRGBToLinear(parseMaterialColor(props, "glazing_transmission_color", new THREE.Color(1, 1, 1)));
      mapList.glazing_transmission_color_map = parseMaterialGenericConnection(props, "colors", "glazing_transmission_color", null);

      tm.glazing_transmission_roughness = parseMaterialScalar(props, "glazing_transmission_roughness", 0);
      mapList.glazing_transmission_roughness_map = parseMaterialGenericConnection(props, "scalars", "glazing_transmission_roughness", null);

      tm.side = parseMaterialGeneric(props, "booleans", "glazing_backface_culling", false) ? THREE.FrontSide : THREE.DoubleSide;

      tm.transparent = true;

      break;
    case 'PrismWood':
      parseWoodMap(tm, props, "wood_fiber_cosine");

      parseWoodMap(tm, props, "wood_fiber_perlin");
      tm.wood_fiber_perlin_scale_z = parseMaterialGeneric(props, "scalars", "wood_fiber_perlin_scale_z", 0);

      parseWoodMap(tm, props, "wood_growth_perlin");

      tm.wood_latewood_ratio = parseMaterialGeneric(props, "scalars", "wood_latewood_ratio", 0);
      tm.wood_earlywood_sharpness = parseMaterialGeneric(props, "scalars", "wood_earlywood_sharpness", 0);
      tm.wood_latewood_sharpness = parseMaterialGeneric(props, "scalars", "wood_latewood_sharpness", 0);
      tm.wood_ring_thickness = parseMaterialGeneric(props, "scalars", "wood_ring_thickness", 0);

      parseWoodMap(tm, props, "wood_earlycolor_perlin");
      tm.wood_early_color = SRGBToLinear(parseMaterialColor(props, "wood_early_color", new THREE.Color(1, 0, 0)));

      tm.wood_use_manual_late_color = parseMaterialGeneric(props, "booleans", "wood_use_manual_late_color", 0);
      tm.wood_manual_late_color = SRGBToLinear(parseMaterialColor(props, "wood_manual_late_color", new THREE.Color(1, 0, 0)));

      parseWoodMap(tm, props, "wood_latecolor_perlin");
      tm.wood_late_color_power = parseMaterialGeneric(props, "scalars", "wood_late_color_power", 0);

      parseWoodMap(tm, props, "wood_diffuse_perlin");
      tm.wood_diffuse_perlin_scale_z = parseMaterialGeneric(props, "scalars", "wood_diffuse_perlin_scale_z", 0);

      tm.wood_use_pores = parseMaterialGeneric(props, "booleans", "wood_use_pores", 0);
      tm.wood_pore_type = parseMaterialGeneric(props, "choicelists", "wood_pore_type", 0);
      tm.wood_pore_radius = parseMaterialGeneric(props, "scalars", "wood_pore_radius", 0);
      tm.wood_pore_cell_dim = parseMaterialGeneric(props, "scalars", "wood_pore_cell_dim", 0);
      tm.wood_pore_color_power = parseMaterialGeneric(props, "scalars", "wood_pore_color_power", 0);
      tm.wood_pore_depth = parseMaterialGeneric(props, "scalars", "wood_pore_depth", 0);

      tm.wood_use_rays = parseMaterialGeneric(props, "booleans", "wood_use_rays", 0);
      tm.wood_ray_color_power = parseMaterialGeneric(props, "scalars", "wood_ray_color_power", 0);
      tm.wood_ray_seg_length_z = parseMaterialGeneric(props, "scalars", "wood_ray_seg_length_z", 0);
      tm.wood_ray_num_slices = parseMaterialGeneric(props, "integers", "wood_ray_num_slices", 0);
      tm.wood_ray_ellipse_z2x = parseMaterialGeneric(props, "scalars", "wood_ray_ellipse_z2x", 0);
      tm.wood_ray_ellipse_radius_x = parseMaterialGeneric(props, "scalars", "wood_ray_ellipse_radius_x", 0);

      tm.wood_use_latewood_bump = parseMaterialGeneric(props, "booleans", "wood_use_latewood_bump", 0);
      tm.wood_latewood_bump_depth = parseMaterialGeneric(props, "scalars", "wood_latewood_bump_depth", 0);

      tm.wood_use_groove_roughness = parseMaterialGeneric(props, "booleans", "wood_use_groove_roughness", 0);
      tm.wood_groove_roughness = parseMaterialGeneric(props, "scalars", "wood_groove_roughness", 0);
      tm.wood_diffuse_lobe_weight = parseMaterialGeneric(props, "scalars", "wood_diffuse_lobe_weight", 0);

      tm.wood_curly_distortion_enable = parseMaterialGeneric(props, "booleans", "wood_curly_distortion_enable", 0);
      tm.wood_curly_distortion_scale = parseMaterialGeneric(props, "scalars", "wood_curly_distortion_scale", 0);
      mapList.wood_curly_distortion_map = parseMaterialGenericConnection(props, "scalars", "wood_curly_distortion_map", null);

      //Create the wood noise textures. They are used for all wood materials.
      if (!PrismWoodTexture)
      InitPrism3DWoodTextures();

      tm.uniforms.permutationMap.value = PrismWoodTexture['permutation'];
      tm.uniforms.gradientMap.value = PrismWoodTexture['gradient'];
      tm.uniforms.perm2DMap.value = PrismWoodTexture['perm2D'];
      tm.uniforms.permGradMap.value = PrismWoodTexture['permGrad'];

      break;

    default:
      console.warn('Unknown prism type: ' + tm.prismType);}


  if (tm.enableImportantSampling && (tm.surface_anisotropy || tm.surface_rotation || tm.layered_anisotropy || tm.layered_rotation)) {
    if (!PrismImportantSamplingTexture)
    InitPrismImportantSamplingTextures();
    tm.uniforms.importantSamplingRandomMap.value = PrismImportantSamplingTexture.randomNum;
    tm.uniforms.importantSamplingSolidAngleMap.value = PrismImportantSamplingTexture.solidAngle;
  }

  // now that the mapList is set up, populate it
  tm.defines = {};
  tm.textureMaps = {};
  for (var p in mapList) {
    // does the map exist? If not, continue on.
    if (!mapList[p])
    continue;

    // the map exists for this property, so set the various values.
    var textureObj = innerMats[mapList[p]];
    texProps = textureObj["properties"];
    textureObj.matrix = get2DMapTransform(textureObj, true, sceneUnit);

    var uriType = textureObj["definition"] == "BumpMap" ?
    "bumpmap_Bitmap" :
    "unifiedbitmap_Bitmap";

    var uriPointer = texProps["uris"][uriType]["values"];
    var uri = uriPointer[0];
    if (!uri)
    continue;

    map = {
      mapName: p,
      uri: uri,
      uriPointer: uriPointer,
      textureObj: textureObj,
      isPrism: true };

    tm.textureMaps[map.mapName] = map;

    // This array gives the various #defines that are associated with this instance of
    // the PRISM material.
    tm.defines["USE_" + p.toUpperCase()] = "";
  }

  tm.defines[tm.prismType.toUpperCase()] = "";
  if (tm.prismType == 'PrismWood' && tm.enable3DWoodBump)
  tm.defines['PRISMWOODBUMP'] = "";
  if (tm.enableImportantSampling)
  tm.defines['ENABLEIMPORTANTSAMPLING'] = "";

  return tm;
}


// takes a 4x4 matrix
function buildTextureTransform(mtx, trans, rotate, scale)
{
  // Build a 3D "TRS" matrix: translate, then rotate (ZYX) with the translated coordinate
  // system, then scale with the rotated coordinate system.  This mimics what is done in the
  // 3ds Max material editor.
  mtx.scale(scale);
  var s = new THREE.Vector3(Math.sin(rotate.x), Math.sin(rotate.y), Math.sin(rotate.z));
  var c = new THREE.Vector3(Math.cos(rotate.x), Math.cos(rotate.y), Math.cos(rotate.z));
  var sysx = s.y * s.x;
  var sycx = s.y * c.x;
  var rmtx = new THREE.Matrix4();
  rmtx.set(
  c.z * c.y, s.z * c.y, -s.y, 0,
  c.z * sysx - s.z * c.x, s.z * sysx + c.z * c.x, c.y * s.x, 0,
  c.z * sycx + s.z * s.x, s.z * sycx - c.z * s.x, c.y * c.x, 0,
  0, 0, 0, 1);


  rmtx.multiply(mtx);
  mtx.makeTranslation(trans.x, trans.y, trans.z);
  mtx.multiply(rmtx);
}

// we implement just the z axis rotation, since that's all that is used
function rotate_euler(z)
{
  var sz = Math.sin(z);
  var cz = Math.cos(z);

  // rotates the transform itself clockwise, meaning the texture itself will rotate counterclockwise.
  var mtx = new THREE.Matrix4();
  mtx.set(
  cz, -sz, 0, 0,
  sz, cz, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1);


  return mtx;
}

/// Extract the texture transform matrix from prism effect instance
function extractTextureTransformByPriority(prismMaterial)
{
  // a Prism material instance could have several textures. We extract one by predefined priority
  var priorityTexture = [
  "opaque_albedo_map",
  "opaque_f0_map",
  "layered_diffuse_map",
  "layered_bottom_f0_map",
  "surface_roughness_map",
  "surface_normal_map",
  "surface_albedo_map",
  "surface_anisotropy_map",
  "surface_cutout_map"];


  if (prismMaterial.textureMaps !== undefined) {
    for (var p = 0; p < priorityTexture.length; ++p)
    {
      // check texture input exists
      if (prismMaterial.textureMaps[priorityTexture[p]] !== undefined) {
        // check texture transform exists
        if (prismMaterial.textureMaps[priorityTexture[p]].textureObj !== undefined) {
          if (prismMaterial.textureMaps[priorityTexture[p]].textureObj.matrix !== undefined) {
            var e = prismMaterial.textureMaps[priorityTexture[p]].textureObj.matrix.elements;
            var mtx = new THREE.Matrix4();
            // Convert the 3x3 to a 4x4. We need a 4x4 because we combine it with other transforms.
            // Old three.js does not have a good 3x3 matrix library.
            mtx.set(
            e[0], e[1], 0, e[2],
            e[3], e[4], 0, e[5],
            0, 0, 1, 0,
            e[6], e[7], 0, e[8]);

            return mtx;
          }
        }
      }
    }
  }

  // nothing found, return identity.
  return new THREE.Matrix4();
}

// float4x4 BuildTextureTransform(float2 offset, float3 rotation, float2 tiling, float3 center)
function buildTextureTransformOS(offset, scale)
{
  // Build a 2D texture transformation matrix that mimics what is done in the 3ds Max material
  // editor.
  // NOTE: The translation indicates an apparent shift in the image (e.g. positive x is to the
  // right), which is the opposite of translating the texture coordinates, so the translation
  // is negated here.
  //float4x4 mtx = translate(float4(-center.x, -center.y, -center.z, 0.0f));// center offset
  //mtx = mul(translate(float4(-offset.x, -offset.y, 0.0f, 0.0f)), mtx);    // translate
  //mtx = mul(scale(float4(scale.x, scale.y, 1.0f, 1.0f)), mtx);          // scale
  //mtx = mul(rotate_euler(float4(rotation, 0.0f)), mtx);                   // rotate
  //mtx = mul(translate(float4(center.x, center.y, center.z, 0.0f)), mtx);  // center restore

  var mtx = new THREE.Matrix4();
  mtx.makeScale(scale.x, scale.y, 1);
  var tmtx = new THREE.Matrix4();
  tmtx.makeTranslation(-offset.x, -offset.y, 0);
  mtx.multiply(tmtx);

  return mtx;
}

/// Compute the random axis and alignment offset for random
function computeRandomnessParameters(material, tile)
{
  // port from OGS, from https://git.autodesk.com/rapidrt/vxrender/blob/master/src/renderer/rapid_renderer/prism/nodes/TileNode.cpp.
  // function void init(const PropertyCollectionOwner& material, Node::IDelegate& delegate)

  if (tile.randomOffsetMode === 0) return;

  material.tilingRandomAxisS = new THREE.Vector2();
  material.tilingRandomAxisT = new THREE.Vector2();
  material.tilingRandomAlignmentOffset = new THREE.Vector2();

  var outRandomAxisS = material.tilingRandomAxisS;
  outRandomAxisS.set(1.0, 0.0);
  var outRandomAxisT = material.tilingRandomAxisT;
  outRandomAxisT.set(0.0, 1.0);
  var outRandomTileAlignOffset = material.tilingRandomAlignmentOffset;
  outRandomTileAlignOffset.set(0.0, 0.0);

  // transform for tile vertices to texture space
  var xform = new THREE.Matrix4();

  // inverse matrix from texture space to random offset
  var invXform = new THREE.Matrix4();

  // get texture transform matrix from sub material effect instance
  var textureXform = extractTextureTransformByPriority(material);

  // always true: if (mFlipRandomV)
  {// TODOTODO needed? Could be the case we *don't* need to do this for WebGL.
    // if the texture flips Y, revert the flip matrix from texture transform
    var flip = buildTextureTransformOS(new THREE.Vector2(0.0, 1.0), new THREE.Vector2(1.0, -1.0));
    flip.multiply(textureXform); // sadly, there's no premultiply matrix method in r71
    textureXform.copy(flip);
  }

  // apply per-tile rotation to texture transform
  xform.multiplyMatrices(textureXform, material.tilingUVTransform);
  invXform.copy(xform).invert();

  // calculate random axis in tile space by applying the inverse transform matrix to texture space axis
  var tvec3 = new THREE.Vector4(1, 0, 0, 0).applyMatrix4(invXform);
  outRandomAxisS.set(tvec3.x, tvec3.y);
  tvec3 = new THREE.Vector4(0, 1, 0, 0).applyMatrix4(invXform);
  outRandomAxisT.set(tvec3.x, tvec3.y);

  var tvec2 = new THREE.Vector2();
  // compute tile bounding box in texture space
  var bounding = new THREE.Box2();
  var verts = tile.alignedVertices;
  for (var vi = 0; vi < verts.length; vi++) {
    tvec3.set(verts[vi].x, verts[vi].y, 0, 1);
    tvec3.applyMatrix4(xform);
    tvec2.set(tvec3.x, tvec3.y);
    bounding.expandByPoint(tvec2);
  }

  // compute offset to move align tile bounding box to origin of texture in texture space,
  // then convert back to tile space
  tvec3.set(-bounding.min.x, -bounding.min.y, 0, 0);
  tvec3.applyMatrix4(invXform);
  outRandomTileAlignOffset.set(tvec3.x, tvec3.y);

  // scale random axis for bounded random mode
  var size = bounding.getSize(new THREE.Vector3());
  var transformedTileDims = tile.randomOffsetMode === 1 ?
  new THREE.Vector2(size.x, size.y) :
  new THREE.Vector2(0, 0);
  // How much the texture can be wiggled. This axis can in fact become 0,0 due to the current algorithm.
  outRandomAxisS.multiplyScalar(1 - transformedTileDims.x);
  outRandomAxisT.multiplyScalar(1 - transformedTileDims.y);
}


// OGS equivalent: MaterialTilingPattern in MaterialTilingPattern.inl
// input JSON data is in matObj, globalTile, and the inputTiles array.
// modify the set of allocated output tile materials, adding parameters as needed.
function materialTilingPattern(matObj, globalTile, inputTiles, decals, sceneUnit) {
  // Determine global tiling values,
  // then rasterize tiles to MSDF and (optional) normal maps,
  // then fill in uniforms for each material.

  // tiling properties
  var tilingProps = globalTile["properties"];

  // We'll discard this global tiling object when done - it is just convenient to make an object created from
  // matObj's TilingPatternSchema and pass it around.
  var tiling = {
    overallTransform: new THREE.Matrix4(),
    insetSize: 0, // was: insetRadius
    hasRoundCorner: false,
    cornerRoundingAngle: 0,
    cornerRoundingSize: 0,
    offsetVectorA: new THREE.Vector2(),
    offsetVectorB: new THREE.Vector2() };


  var scaleFactor = new THREE.Vector2(
  parseMaterialScalarWithSceneUnit(tilingProps, "scale_factor_x", sceneUnit, 1),
  parseMaterialScalarWithSceneUnit(tilingProps, "scale_factor_y", sceneUnit, 1));


  // get overall transforms
  var overallOffsetX = parseMaterialScalarWithSceneUnit(tilingProps, "overall_offset_vector_x", sceneUnit, 1);
  var overallOffsetY = parseMaterialScalarWithSceneUnit(tilingProps, "overall_offset_vector_y", sceneUnit, 1);

  // TODOTODO - it is not documented as to what the units are for angles. Once known, add & implement
  // some form of parseMaterialScalarWithSceneUnit, but instead of it calling ConvertDistance it needs to ConvertAngle,
  // "rad" or "deg" or whatever they specify. See https://wiki.autodesk.com/display/saascore/Tiling+ProteinMaterials.json
  var overallRotateAngle = parseMaterialScalar(tilingProps, "overall_rotation_angle", 0) * Math.PI / 180.0; // degrees to radians

  buildTextureTransform(tiling.overallTransform,
  new THREE.Vector3(-overallOffsetX, -overallOffsetY, 0.0),
  new THREE.Vector3(0.0, 0.0, -overallRotateAngle),
  new THREE.Vector3(1.0, 1.0, 1.0));


  // inset size, convert to tile vertices coordinate
  tiling.insetSize = parseMaterialScalarWithSceneUnit(tilingProps, "inset_size", sceneUnit, 1);

  // corner rounding angle
  // TODOTODO - it is not documented as to what the units are for angles. Once known, add & implement this conversion function, as above
  tiling.cornerRoundingAngle = parseMaterialScalar(tilingProps, "overall_corner_rounding_angle", 0) * Math.PI / 180.0; // degrees to radians

  // corner rounding size/radius, convert to tile vertices coordinate
  tiling.cornerRoundingSize = parseMaterialScalarWithSceneUnit(tilingProps, "overall_corner_rounding_size", sceneUnit, 1);

  // repeat offset vectors
  // TODOTODO note that the current file has units, which is an error; the spec shows no units.
  // See https://wiki.autodesk.com/display/saascore/Tiling+ProteinMaterials.json
  // We (properly) ignore units here, using only the scale factors
  tiling.offsetVectorA.x = parseMaterialScalar(tilingProps, "offset_vector_a_x", 0) * scaleFactor.x;
  tiling.offsetVectorA.y = parseMaterialScalar(tilingProps, "offset_vector_a_y", 0) * scaleFactor.y;
  tiling.offsetVectorB.x = parseMaterialScalar(tilingProps, "offset_vector_b_x", 0) * scaleFactor.x;
  tiling.offsetVectorB.y = parseMaterialScalar(tilingProps, "offset_vector_b_y", 0) * scaleFactor.y;

  tiling.hasRoundCorner = tiling.cornerRoundingAngle > 0 && tiling.cornerRoundingSize > 0;

  var ti, tlen;
  // where we put the materials for the individual tilings, before "real" decals are applied
  // scale vertices directly into world units, in place
  var tiles = [];
  for (ti = 0, tlen = inputTiles.length; ti < tlen; ti++) {
    var inputTileProps = inputTiles[ti]["properties"];
    var tile = {
      material: decals[ti].material,
      randomOffsetMode: 0, // note that the material does not need to copy this value
      rotation: 0,
      vertices: [] };

    tiles[ti] = tile;
    // move tile information over from TilingAppearanceSchema
    tile.randomOffsetMode = parseMaterialGeneric(inputTileProps, "choicelists", "random_offset_mode", 0);
    // TODOTODO - it is not documented as to what the units are for angles. Once known, add & implement
    tile.rotation = parseMaterialScalar(inputTileProps, "rotation_angle", 0) * Math.PI / 180.0;
    // copy vertex array into Vector2's
    var vertList = inputTileProps["scalars"]["vertices"]["values"];
    for (var i = 0; i < vertList.length; i += 2) {
      tile.vertices[i / 2] = new THREE.Vector2(vertList[i], vertList[i + 1]);
    }

    // Use world scale factors to scale up vertices. Note there is no per-vertex-set unit scale factor.
    for (var vi = 0; vi < tile.vertices.length; vi++) {
      tile.vertices[vi].multiply(scaleFactor);
    }
    // per tile derived information; material just needs to know that random mode is on,
    // mode info is baked into the material's textures and vectors
    tile.material.useRandomOffset = tile.randomOffsetMode != 0;
  }

  // translate tile material asset and add the tile
  rasterizeTiles(tiling, tiles);

  // fill in uniforms
  var m2x2 = [tiling.offsetVectorA.clone(), tiling.offsetVectorB.clone()];
  var invM2x2 = invert(m2x2);

  for (ti = 0, tlen = tiles.length; ti < tlen; ti++) {
    var _tile = tiles[ti];
    var material = _tile.material;

    // TODOTODOTODO these should perhaps just be put in material, end of story?
    material.tilingOverallTransform = tiling.overallTransform;
    material.hasRoundCorner = tiling.hasRoundCorner;

    // per-tile texture rotation - TODO could be a 3x3, really
    material.tilingUVTransform = rotate_euler(_tile.rotation);

    if (material.useRandomOffset) {
      // compute random offset axis, and texture offset to support Bounded random mode
      computeRandomnessParameters(material, _tile);
    }

    // OGS: SetTilingParameters
    // calculate tile to uv and uv to tile transform matrixes
    material.tile2uv = new THREE.Vector4(tiling.offsetVectorA.x, tiling.offsetVectorA.y, tiling.offsetVectorB.x, tiling.offsetVectorB.y);
    material.uv2tile = new THREE.Vector4(invM2x2[0].x, invM2x2[0].y, invM2x2[1].x, invM2x2[1].y);
  }
}

function rasterizeTiles(tiling, tiles) {
  // calculate the tile repeat box, which is the parallelogram formed by repeat axis A & B
  var tileRepeatABBox = new THREE.Box2();
  tileRepeatABBox.expandByPoint(new THREE.Vector2(0.0, 0.0));
  tileRepeatABBox.expandByPoint(tiling.offsetVectorA);
  tileRepeatABBox.expandByPoint(tiling.offsetVectorB);
  var vec = new THREE.Vector2(tiling.offsetVectorA.x, tiling.offsetVectorA.y);
  vec.add(tiling.offsetVectorB);
  tileRepeatABBox.expandByPoint(vec);

  var ti, tlen;
  // for each tile
  for (ti = 0, tlen = tiles.length; ti < tlen; ti++) {
    var tile = tiles[ti];

    // compute repeat range that tile may cover the repeat ABBox
    tile.material.tilingRepeatRange = [];
    computeRange(tiling, tile, tile.material.tilingRepeatRange);

    // compute bbox - we compute this once, early on, since it is used by buildMSDFTexture
    tile.bbox = new THREE.Box2();
    for (var v = 0; v < tile.vertices.length; ++v)
    {
      tile.bbox.expandByPoint(tile.vertices[v]);
    }

    // build MSDF texture for the tile
    buildMSDFTexture(tiling, tile);

    // build normal map if it has a rounding corner
    if (tiling.hasRoundCorner) {
      buildNormalMap(tiling, tile);
    }

    // build randomness map if random is enabled
    if (tile.material.useRandomOffset) {
      buildRandomnessMap(tile, ti);
    }

    // reset tile vertices to align with tile bounding box
    tile.alignedVertices = [];
    for (var _v = 0; _v < tile.vertices.length; ++_v)
    {
      var newPoint = new THREE.Vector2(tile.vertices[_v].x, tile.vertices[_v].y);
      newPoint.sub(tile.bbox.min);
      tile.alignedVertices.push(newPoint);
    }

    // set tile alignment offset. It moves origin of tile texture UV to left-bottom corner of
    // tile bounding box. OGS calls this tileOffset
    tile.material.tileAlignOffset = new THREE.Vector2(-tile.bbox.min.x, -tile.bbox.min.y);
  }
}

function computeNormalToEdges(tile, cornerRoundingAngle)
{
  tile.normalToEdges = [];

  var edges = tile.vertices.length;

  var zComponent = Math.cos(cornerRoundingAngle);
  var factor = Math.sin(cornerRoundingAngle); // 1.0 - zComponent * zComponent;

  for (var edgeIndex = 0; edgeIndex < edges; ++edgeIndex)
  {
    var startIndex = edgeIndex;
    var endIndex = edgeIndex == edges - 1 ? 0 : edgeIndex + 1;

    var tempEdge = new THREE.Vector2(tile.vertices[endIndex].x, tile.vertices[endIndex].y);
    tempEdge.sub(tile.vertices[startIndex]);
    tempEdge.normalize();

    var normalToEdge = new THREE.Vector3(tempEdge.y * factor, -tempEdge.x * factor, zComponent);

    tile.normalToEdges.push(normalToEdge);
  }
  tile.cornerRoundingAngle = cornerRoundingAngle;
}

function distanceToSegment(q, p0, p1)
{
  var d = new THREE.Vector2(p1.x, p1.y).sub(p0);

  var qp0 = new THREE.Vector2(q.x, q.y).sub(p0);

  var t = d.dot(qp0);

  if (t <= 0.0) {
    // p0 is closest to q
    return qp0.length();
  }

  var d2 = d.dot(d);
  if (t >= d2) {
    // p1 is closest to q
    var qp1 = new THREE.Vector2(q).sub(p1);
    return qp1.length();
  }

  // otherwise closest point is interior to segment
  return Math.sqrt(Math.max(qp0.dot(qp0) - t * t / d2, 0.0));
}

// TileTexturalizer::Tile::DistanceToTile
function distanceToTileAndIndex(tile, pixelLoc)
{
  var bestDistance = 10e10;
  var currentDistance = bestDistance;

  var edgeIndex = -1;

  for (var i = 0; i < tile.vertices.length; i++) {

    var j = i == tile.vertices.length - 1 ? 0 : i + 1;

    currentDistance = distanceToSegment(pixelLoc, tile.vertices[i], tile.vertices[j]);

    if (currentDistance < bestDistance) {

      bestDistance = currentDistance;
      edgeIndex = i;
    }
  }

  return [bestDistance, edgeIndex];
}

function pointInTilePolygon(vertices, x, y)
{
  var polyCorners = vertices.length;

  var j = polyCorners - 1;
  var oddNodes = false;

  for (var i = 0; i < polyCorners; ++i) {
    if (vertices[i].y < y && vertices[j].y >= y || vertices[j].y < y && vertices[i].y >= y)
    {
      if (vertices[i].x + (y - vertices[i].y) / (vertices[j].y - vertices[i].y) * (vertices[j].x - vertices[i].x) < x)
      {
        oddNodes = !oddNodes;
      }
    }
    j = i;
  }

  return oddNodes;
}


function buildNormalMap(tiling, tile)
{
  var tileBBSize = tile.bbox.getSize(new THREE.Vector3());

  // Evaluate the size for normal map texture.
  // to make normal map provide enough precision in the case of large tile but small corner size,
  // the normal map must use enough texels to cover the rounding edge. To sample correct normal
  // on the edge, we extend normal map out by another mCornerRoundingRadius distance. Also notice,
  // normal value is continually at the inner side of the rounding edge, but discontinuity on the
  // outside. So we need 3 texels to cover the rounding edge. Also consider the worst case of 45
  // degree case, our final pixel size is mCornerRoundingRadius * 2.0 / sqrt(2) / 3.0;
  var pixelSize = tiling.cornerRoundingSize * 2.0 * 0.7071 / 3.0;

  // To prevent meaningless sampling on normal texture bounding, add one pixel gap on each bound.
  // also, to prevent too small or too large texture size, limit texture size between 128 and 1024
  var width = clamp(Math.ceil(tileBBSize.x / pixelSize) + 2, 128, 1024);
  var height = clamp(Math.ceil(tileBBSize.y / pixelSize) + 2, 128, 1024);

  // Adjust the width or height so the ratio is the same as tileBBSize.
  {
    // leave out one pixel on boundary
    width -= 2;
    height -= 2;
    if (tileBBSize.x < tileBBSize.y)
    {
      // scale to keep width/height factor
      height = Math.floor(width * tileBBSize.y / tileBBSize.x);
    } else

    {
      // scale to keep width/height factor
      width = Math.floor(height * tileBBSize.x / tileBBSize.y);
    }

    // add back bounding pixel
    width += 2;
    height += 2;
  }

  computeNormalToEdges(tile, tiling.cornerRoundingAngle);

  var pixels = new Uint8Array(width * height * 4);

  // scale factor from tile vertices to image
  // scaled in one pixel each side for correct bilinear sampling on bound
  var scale = new THREE.Vector2(tileBBSize.x / (width - 2), tileBBSize.y / (height - 2));

  var pixelLoc = new THREE.Vector2();
  var pointNormal = new THREE.Vector3();
  var defaultNormal = new THREE.Vector3(0.0, 0.0, 1.0);

  //console.log("P3\n" + width + " " + height + "\n255");
  var idx = 0;
  for (var i = 0; i < height; i++)
  {
    // Begin from -1 for the one pixel left out along the edge. Move 0.5f to center the texel.
    // NOTE: we do a y reverse here for the texture, OpenGL-style. DX is simply "(i - 0.5)".
    pixelLoc.y = (height - i - 1.5) * scale.y + tile.bbox.min.y;

    for (var j = 0; j < width; j++)
    {
      // Begin from -1 for the one pixel left out. Move 0.5f to center the texel.
      pixelLoc.x = (j - 0.5) * scale.x + tile.bbox.min.x;

      // we always calculate distance to tile for all pixels, but only write down normal into
      // normal map for distance less than corner rounding radius, so that we can have smooth
      // normal from tile center to edge. We add negative flag to pixels that out of polygon,
      // so that we would have correct interpreted value on edge
      var dttei = distanceToTileAndIndex(tile, pixelLoc);
      var distanceToTile = dttei[0];
      var edgeIndex = dttei[1];
      if (distanceToTile < tiling.cornerRoundingSize + tiling.insetSize)
      {
        if (!pointInTilePolygon(tile.vertices, pixelLoc.x, pixelLoc.y))
        {
          distanceToTile = -distanceToTile;
        }
        pointNormal.copy(tile.normalToEdges[edgeIndex]);
        pointNormal.lerp(defaultNormal, (distanceToTile - tiling.insetSize) / tiling.cornerRoundingSize);
        pointNormal.normalize();

        // to avoid value flow out of 8-bit storage, we save normalized pointNormal in
        // normal map. In pixel shader, we need minus (0,0,1) to get normal diff, then
        // apply the normal diff to geometry normal
        // Note that Math.int is implied, as these get stored in unsigned ints
        pixels[idx++] = clamp((pointNormal.x + 1.0) * 0.5, 0.0, 1.0) * 255;
        pixels[idx++] = clamp((pointNormal.y + 1.0) * 0.5, 0.0, 1.0) * 255;
        pixels[idx++] = clamp((pointNormal.z + 1.0) * 0.5, 0.0, 1.0) * 255;
        pixels[idx++] = 255;
      } else {
        pixels[idx++] = 127;
        pixels[idx++] = 127;
        pixels[idx++] = 255;
        pixels[idx++] = 255;
      }
      //console.log(pixels[idx-4] + " " + pixels[idx-3] + " " + pixels[idx-2] + " ");
    }
  }
  //console.log("============ NORMAL BREAK ==============");

  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
  // there is no "border color" supported for textures in WebGL, no BorderColor(OGS::float4(0.5f, 0.5f, 0.5f, 1.0f)
  // which would call mCtx->GLAPI()->glTexParameterfv(mObjTarget,_kGL_TEXTURE_BORDER_COLOR, border);


  // Create tile pattern texture
  tile.material.TilingNormalMap = new THREE.DataTexture(pixels, width, height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping,
  THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping,
  THREE.LinearFilter, THREE.LinearFilter);
  // You'd think this would be the default setting for a new DataTexture. You'd be wrong. Without it the texture will not get loaded.
  tile.material.TilingNormalMap.needsUpdate = true;

  var tileBBOffset = new THREE.Vector2(-tile.bbox.min.x, -tile.bbox.min.y);
  tile.material.TilingNormalMap_texMatrix = new THREE.Matrix3();
  // note that the original C++ code assumes row-major form (translations in the bottom row), while three.js
  // assumes column-major, though of course internally putting the translations in the last 4 spots in the array.
  // Rather than mess with the code, we keep the row-major form here, and then transpose.
  // NOTE: we use a 3x3 transform here, unlike OGS.
  tile.material.TilingNormalMap_texMatrix.set(
  1.0 / tileBBSize.x * (width - 2.0) / width, 0.0, 0.0,
  0.0, 1.0 / tileBBSize.y * (height - 2.0) / height, 0.0,
  //0.0, 0.0, 1.0, 0.0,
  tileBBOffset.x / tileBBSize.x * (width - 2.0) / width + 1.0 / width,
  tileBBOffset.y / tileBBSize.y * (height - 2.0) / height + 1.0 / height,
  1.0);

  tile.material.TilingNormalMap_texMatrix.transpose();
}

function burtlerot(x, k) {
  return x << k | x >>> 32 - k; // note >>> if you ever touch this code: need this zero-fill shift for unsigned ints
}

function burtlefinal(a, b, c) {
  var fullbits = 4294967296; // 2**32
  c ^= b;c = (c - burtlerot(b, 14) + fullbits) % fullbits;
  a ^= c;a = (a - burtlerot(c, 11) + fullbits) % fullbits;
  b ^= a;b = (b - burtlerot(a, 25) + fullbits) % fullbits;
  c ^= b;c = (c - burtlerot(b, 16) + fullbits) % fullbits;
  a ^= c;a = (a - burtlerot(c, 4) + fullbits) % fullbits;
  b ^= a;b = (b - burtlerot(a, 14) + fullbits) % fullbits;
  c ^= b;c = (c - burtlerot(b, 24) + fullbits) % fullbits;
  return c;
}

function burtlehashword(
key, /* the key */
//we assume key length of 2, as this is how OGS always uses it
//size_t          length,               /* the length of the key, in uint32_ts */
initval) /* the previous hash, or an arbitrary value */
{
  var a, b, c;

  /* Set up the internal state */
  a = b = c = 0xdeadbeef + (2 << 2) + initval;

  b += key.y;
  a += key.x;
  return burtlefinal(a, b, c);
}

// stripped way down from the OGS version, which always uses a seed array of size 2.
// From //depot/Raas/current/rsut/include/rsut/detail/burtle_hash_impl.hpp
function burtleNoise2Byte(seed2, result2)
{
  var hash = burtlehashword(seed2, 33);

  // low 16bit for x, and high 16bit for y, converted to 0-255 pixel values
  result2.x = (hash & 0xFFFF) >>> 8;
  result2.y = hash >>> 16 >>> 8;
}


function buildRandomnessMap(tile, seed)
{
  var width = 512;
  var height = 512;
  var PRIME = 107021;

  var pixels = new Uint8Array(width * height * 4);

  var pixelLoc = new THREE.Vector2();

  var seedVector = new THREE.Vector2(PRIME * seed, seed);
  var hashTranslationID = new THREE.Vector2();
  var randomOffset = new THREE.Vector2();

  //console.log("P3\n" + width + " " + (height/16) + "\n255");
  var idx = 0;
  for (var i = 0; i < height; i++)
  {
    // Begin from -1 for the one pixel left out along the edge. Move 0.5f to center the texel.
    // Move (0,0) to the center of texture
    // NOTE: we do a y reverse here for the texture, OpenGL-style. DX is simply "i - height / 2".
    //pixelLoc.y = Math.floor(i - height / 2); // Original code. For testing against OGS
    pixelLoc.y = Math.floor(-(i + 1 - height / 2));

    for (var j = 0; j < width; j++)
    {
      // Move (0,0) to the center of texture
      pixelLoc.x = Math.floor(j - width / 2);

      hashTranslationID.copy(pixelLoc);
      hashTranslationID.add(seedVector);
      burtleNoise2Byte(hashTranslationID, randomOffset);

      pixels[idx++] = 0; // unused byte
      pixels[idx++] = 0; // unused byte
      pixels[idx++] = randomOffset.x;
      pixels[idx++] = randomOffset.y;
      //if ( i % 16 === 0 )
      //    console.log(pixels[idx-3] + " " + pixels[idx-2] + " " + pixels[idx-1] + " ");
    }
  }
  //console.log("============ NORMAL BREAK ==============");

  // Create tile pattern texture
  tile.material.TilingRandomMap = new THREE.DataTexture(pixels, width, height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping,
  THREE.RepeatWrapping, THREE.RepeatWrapping,
  THREE.NearestFilter, THREE.NearestFilter);
  // You'd think this would be the default setting for a new DataTexture. You'd be wrong. Without it the texture will not get loaded.
  tile.material.TilingRandomMap.needsUpdate = true;

  tile.material.TilingRandomMap_texMatrix = new THREE.Matrix3();
  // note that the original C++ code assumes row-major form (translations in the bottom row), while three.js
  // assumes column-major, though of course internally putting the translations in the last 4 spots in the array.
  // Rather than mess with the code, we keep the row-major form here, and then transpose.
  // NOTE: we use a 3x3 transform here, unlike OGS.
  tile.material.TilingRandomMap_texMatrix.set(
  1.0 / width, 0.0, 0.0,
  0.0, 1.0 / height, 0.0,
  //0.0, 0.0, 1.0, 0.0,
  0.5, 0.5, 1.0);

  tile.material.TilingRandomMap_texMatrix.transpose();
}

function computeRange(tiling, tile, range)
{
  // convert all tile vertices to repeat space, then compute bounding box in repeat space.
  // The repeat space is a 2D space by repeat vector mAxisA and mAxisB as its axis.
  var repeat2tile = [];
  repeat2tile[0] = new THREE.Vector2(tiling.offsetVectorA.x, tiling.offsetVectorB.x);
  repeat2tile[1] = new THREE.Vector2(tiling.offsetVectorA.y, tiling.offsetVectorB.y);
  var tile2repeat = invert(repeat2tile);

  var bounding = new THREE.Box2();

  var vertInRepeatSpace = new THREE.Vector2();
  for (var v = 0; v < tile.vertices.length; ++v) {
    vertInRepeatSpace.x = tile.vertices[v].dot(tile2repeat[0]);
    vertInRepeatSpace.y = tile.vertices[v].dot(tile2repeat[1]);

    bounding.expandByPoint(vertInRepeatSpace);
  }

  // compute the offset range, that,
  //     uv + offset = st, where uv belongs to [0, 1]x[0, 1]
  //                             st belongs to bounding of tile
  // This code is more efficient, but fails in a tiny way for
  // OGS test Protein_Material_PrismTiling_TwoObj_Random1
  //let epsilon = 1e-6;
  //range[0] = Math.floor(bounding.min.x + epsilon);
  //range[2] = Math.ceil(bounding.max.x - epsilon);
  //range[1] = Math.floor(bounding.min.y + epsilon);
  //range[3] = Math.ceil(bounding.max.y - epsilon);
  // OGS method. I suspect adding & subtracting epsilon, as above, can be more efficient
  // if there are precision problems.
  range[0] = Math.floor(bounding.min.x - 1);
  range[2] = Math.ceil(bounding.max.x);
  range[1] = Math.floor(bounding.min.y - 1);
  range[3] = Math.ceil(bounding.max.y);
}

function invert(m)
{
  var det = m[0].x * m[1].y - m[0].y * m[1].x;
  var inverse = [];
  inverse[0] = new THREE.Vector2(m[1].y / det, -m[0].y / det);
  inverse[1] = new THREE.Vector2(-m[1].x / det, m[0].x / det);
  return inverse;
}

function clamp(v, min, max) {
  if (v > max)
  return max;
  if (v < min)
  return min;
  return v;
}

function constructMSDF(shape, tile)
{
  // construct MSDF sharp by adding tile polygon as a contor of MSDF
  var contour = shape.addBlankContour();
  var edgeStartPoint = new THREE.Vector2();
  var edgeEndPoint = new THREE.Vector2();
  for (var e = 0; e < tile.vertices.length; ++e)
  {
    var edgeStart = e;
    var edgeEnd = (e + 1) % tile.vertices.length;

    edgeStartPoint = tile.vertices[edgeStart];
    edgeEndPoint = tile.vertices[edgeEnd];

    contour.addEdge(new _MSDF__WEBPACK_IMPORTED_MODULE_1__.MSDFLinearSegment(edgeStartPoint, edgeEndPoint, _MSDF__WEBPACK_IMPORTED_MODULE_1__.MSDF_EDGE_COLOR_WHITE));
  }

  shape.initialize();
  shape.edgeColoringSimple(3.0, 0);
}

function buildMSDFTexture(tiling, tile)
{
  // construct the shape of MSDF
  var msdfShape = new _MSDF__WEBPACK_IMPORTED_MODULE_1__.MSDFShape();
  constructMSDF(msdfShape, tile);

  // rasterize tile into MSDF texture
  var tileBBSize = tile.bbox.getSize(new THREE.Vector3());

  // Evaluate the size for MSDF texture.
  // to prevent MSDF value overlap, the MSDF texture must use more than two texels to cover the
  // shortest distance between any two same colored edges. The shortest distance would face to
  // arbitrary direction, we need consider the worst case, the 45 degree direction. So here use
  // msdfShape.MinSameColoredEdgeDistance() / sqrt(2) as the minimum same colored edge distance
  // on image x and y direction. The direction must cover at least two texels, so our final pixel
  // size is msdfShape.MinSameColoredEdgeDistance() / sqrt(2) / 2.0
  var pixelSize = msdfShape.minSameColoredEdgeDistance() * 0.7071 * 0.5;
  // The final texture size is the tile region to be texturalized divide pixel size.
  // notice warp repeat on tile texture does not make sense. To prevent meaningless sampling on
  // tile texture bounding, add one pixel gap on each bound.
  // also, to prevent too small or too large texture size, limit texture size between 16 and 512.
  var width = clamp(Math.ceil(tileBBSize.x / pixelSize) + 2, 16, 512);
  var height = clamp(Math.ceil(tileBBSize.y / pixelSize) + 2, 16, 512);

  // use RGBA8 formated texture
  //    EFormat format = vd.Caps()->GetCompatibleFormat(EFORMAT_B8G8R8A8, TextureUsage);
  //    int bytesPerPixel = AFormatConvertor::BytesPerPixel(format);

  //    int bytesPerRow = width * bytesPerPixel;
  //    size_t totalImageSize = bytesPerRow*height;
  //    unsigned char* pImageData = new unsigned char[totalImageSize];
  //    int pixelOffset = bytesPerPixel;
  var pixels = new Uint8Array(width * height * 4);

  // leave out one pixel each side for correct bilinear sampling on bound
  var scale = new THREE.Vector2(tileBBSize.x / (width - 2), tileBBSize.y / (height - 2));

  // factor for cut out pixel values in MSDF texture
  var oneOverDistanceUnit = 0.5 / (scale.x + scale.y);

  var pixelLoc = new THREE.Vector2();
  var msdf = new THREE.Vector3();

  var idx = 0;
  //console.log("P3\n" + width + " " + height + "\n255");
  for (var i = 0; i < height; i++)
  {
    // Begin from -1 for the one pixel left out along the edge. Move 0.5f to center the texel.
    // NOTE: we do a y reverse here for the texture, OpenGL-style. DX is simply "(i - 0.5)".
    pixelLoc.y = (height - i - 1.5) * scale.y + tile.bbox.min.y;

    for (var j = 0; j < width; j++)
    {
      // Begin from -1 for the one pixel left out. Move 0.5f to center the texel.
      pixelLoc.x = (j - 0.5) * scale.x + tile.bbox.min.x;

      // get the MSDF value for (x,y)
      msdf = msdfShape.calculateMSDFValue(pixelLoc);

      // considering inset, the real tile edge is the distance to tile edge minus inset size.
      // our msdf is always negative value for inside pixels, so final msdf is msdf+insetSize.
      msdf = msdf.add(new THREE.Vector3(tiling.insetSize, tiling.insetSize, tiling.insetSize));

      // compact float value into 8-bit int
      pixels[idx++] = clamp(msdf.x * oneOverDistanceUnit + 0.5, 0.0, 1.0) * 255.0;
      pixels[idx++] = clamp(msdf.y * oneOverDistanceUnit + 0.5, 0.0, 1.0) * 255.0;
      pixels[idx++] = clamp(msdf.z * oneOverDistanceUnit + 0.5, 0.0, 1.0) * 255.0;
      pixels[idx++] = 0;
      //console.log(pixels[idx-4] + " " + pixels[idx-3] + " " + pixels[idx-2] + " ");
    }
  }

  // Create tile pattern texture
  tile.material.TilingMap = new THREE.DataTexture(pixels, width, height, THREE.RGBAFormat, THREE.UnsignedByteType, THREE.UVMapping,
  THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping,
  THREE.LinearFilter, THREE.LinearFilter);
  // You'd think this would be the default setting for a new DataTexture. You'd be wrong. Without it the texture will not get loaded.
  tile.material.TilingMap.needsUpdate = true;

  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
  // there is no "border color" supported for textures in WebGL, no BorderColor(OGS::float4(1.0f, 1.0f, 1.0f, 1.0f)
  // which would call mCtx->GLAPI()->glTexParameterfv(mObjTarget,_kGL_TEXTURE_BORDER_COLOR, border);

  var tileBBOffset = new THREE.Vector2(-tile.bbox.min.x, -tile.bbox.min.y);
  tile.material.TilingMap_texMatrix = new THREE.Matrix3();
  // note that the original C++ code assumes row-major form (translations in the bottom row), while three.js
  // assumes column-major, though of course internally putting the translations in the last 4 spots in the array.
  // Rather than mess with the code, we keep the row-major form here, and then transpose.
  // NOTE: we use a 3x3 transform here, unlike OGS.
  tile.material.TilingMap_texMatrix.set(
  1.0 / tileBBSize.x * (width - 2.0) / width, 0.0, 0.0,
  0.0, 1.0 / tileBBSize.y * (height - 2.0) / height, 0.0,
  //0.0, 0.0, 1.0, 0.0,
  tileBBOffset.x / tileBBSize.x * (width - 2.0) / width + 1.0 / width,
  tileBBOffset.y / tileBBSize.y * (height - 2.0) / height + 1.0 / height,
  1.0);

  // normally we would set the matrix above with the translations in the column, but we match the code in OGS for
  // maintainability, so we need to transpose here.
  tile.material.TilingMap_texMatrix.transpose();
}


function convertPrismTexture(textureObj, texture, sceneUnit) {

  var texProps = textureObj["properties"];

  // Note that the format of these booleans is different for Protein than for regular materials:
  // Prism: "texture_URepeat": { "values": [ false ] },
  // simple texture: "texture_URepeat":    false,
  texture.clampS = !parseMaterialGeneric(texProps, "booleans", "texture_URepeat", false);
  texture.clampT = !parseMaterialGeneric(texProps, "booleans", "texture_VRepeat", false);
  texture.wrapS = !texture.clampS ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  texture.wrapT = !texture.clampT ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;

  texture.matrix = textureObj.matrix || (textureObj.matrix = Get2DPrismMapTransform(texProps, sceneUnit));

  if (textureObj["definition"] == "UnifiedBitmap") {
    texture.invert = parseMaterialGeneric(texProps, "booleans", "unifiedbitmap_Invert", false);
  }

  if (textureObj["definition"] == "BumpMap") {
    texture.bumpmapType = parseMaterialGeneric(texProps, "choicelists", "bumpmap_Type", 0);
    texture.bumpScale = GetBumpScale(texProps, texture.bumpmapType, sceneUnit);
  }

}

function get2DMapTransform(textureObj, isPrism, sceneUnit) {
  if (!textureObj.matrix) {
    textureObj.matrix = Get2DPrismMapTransform(textureObj.properties, sceneUnit);
  }
  return textureObj.matrix;
}



/***/ }),

/***/ "./extensions/MaterialConverterPrism/PrismShader.js":
/*!**********************************************************!*\
  !*** ./extensions/MaterialConverterPrism/PrismShader.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrismShader": () => (/* binding */ PrismShader),
/* harmony export */   "createPrismMaterial": () => (/* binding */ createPrismMaterial),
/* harmony export */   "clonePrismMaterial": () => (/* binding */ clonePrismMaterial)
/* harmony export */ });
/* harmony import */ var _shaders_prism_vert_glsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaders/prism_vert.glsl */ "./extensions/MaterialConverterPrism/shaders/prism_vert.glsl");
/* harmony import */ var _shaders_prism_vert_glsl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_shaders_prism_vert_glsl__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shaders_prism_frag_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shaders/prism_frag.glsl */ "./extensions/MaterialConverterPrism/shaders/prism_frag.glsl");
/* harmony import */ var _shaders_prism_frag_glsl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_shaders_prism_frag_glsl__WEBPACK_IMPORTED_MODULE_1__);


var avp = Autodesk.Viewing.Private;
var chunks = avp.ShaderChunks;var
createShaderMaterial = avp.ShaderUtils.createShaderMaterial;var _avp$PrismUtil =
avp.PrismUtil,GetPrismMapUniforms = _avp$PrismUtil.GetPrismMapUniforms,GetPrismBumpMapUniforms = _avp$PrismUtil.GetPrismBumpMapUniforms;

var PrismShader = {

  uniforms: THREE.UniformsUtils.merge([

  THREE.UniformsLib["common"],
  THREE.UniformsLib["lights"],
  THREE.UniformsLib["fog"],
  chunks.CutPlanesUniforms,
  chunks.IdUniforms,
  chunks.ThemingUniform,
  chunks.ShadowMapUniforms,

  GetPrismMapUniforms("surface_albedo_map"),
  GetPrismMapUniforms("surface_roughness_map"),
  GetPrismMapUniforms("surface_cutout_map"),
  GetPrismMapUniforms("surface_anisotropy_map"),
  GetPrismMapUniforms("surface_rotation_map"),
  GetPrismMapUniforms("opaque_albedo_map"),
  GetPrismMapUniforms("opaque_f0_map"),
  GetPrismMapUniforms("opaque_luminance_modifier_map"),
  GetPrismMapUniforms("layered_bottom_f0_map"),
  GetPrismMapUniforms("layered_f0_map"),
  GetPrismMapUniforms("layered_diffuse_map"),
  GetPrismMapUniforms("layered_fraction_map"),
  GetPrismMapUniforms("layered_roughness_map"),
  GetPrismMapUniforms("layered_anisotropy_map"),
  GetPrismMapUniforms("layered_rotation_map"),
  GetPrismMapUniforms("metal_f0_map"),
  GetPrismMapUniforms("wood_curly_distortion_map"),
  GetPrismMapUniforms("glazing_f0_map"),
  GetPrismMapUniforms("glazing_transmission_color_map"),
  GetPrismMapUniforms("glazing_transmission_roughness_map"),

  GetPrismBumpMapUniforms("surface_normal_map"),
  GetPrismBumpMapUniforms("layered_normal_map"),

  GetPrismMapUniforms("TilingMap"),
  GetPrismMapUniforms("TilingNormalMap"),
  GetPrismMapUniforms("TilingRandomMap"),

  {
    //Surface
    "surface_albedo": { type: "c", value: new THREE.Color(0x111111) },
    "surface_roughness": { type: "f", value: 1.0 },
    "surface_anisotropy": { type: "f", value: 1.0 },
    "surface_rotation": { type: "f", value: 1.0 },

    //Opaque
    "opaque_albedo": { type: "c", value: new THREE.Color(0x111111) },
    "opaque_f0": { type: "f", value: 1.0 },
    "opaque_luminance_modifier": { type: "c", value: new THREE.Color(0x111111) },
    "opaque_luminance": { type: "f", value: 1.0 },

    //Metal
    "metal_f0": { type: "c", value: new THREE.Color(0x111111) },

    //Layered
    "layered_f0": { type: "f", value: 1.0 },
    "layered_diffuse": { type: "c", value: new THREE.Color(0x000000) },
    "layered_fraction": { type: "f", value: 1.0 },
    "layered_bottom_f0": { type: "c", value: new THREE.Color(0x111111) },
    "layered_roughness": { type: "f", value: 1.0 },
    "layered_anisotropy": { type: "f", value: 1.0 },
    "layered_rotation": { type: "f", value: 1.0 },

    //Transparent
    "transparent_ior": { type: "f", value: 2.0 },
    "transparent_color": { type: "c", value: new THREE.Color(0x111111) },
    "transparent_distance": { type: "f", value: 1.0 },

    //Glazing
    "glazing_f0": { type: "c", value: new THREE.Color(0xffffff) },
    "glazing_transmission_roughness": { type: "f", value: 0.0 },
    "glazing_transmission_color": { type: "c", value: new THREE.Color(0xffffff) },

    //Wood
    "wood_fiber_cosine_enable": { type: "i", value: 1 },
    "wood_fiber_cosine_bands": { type: "i", value: 2 },
    "wood_fiber_cosine_weights": { type: "v4", value: new THREE.Vector4(2.5, 0.5, 1, 1) },
    "wood_fiber_cosine_frequencies": { type: "v4", value: new THREE.Vector4(15, 4, 1, 1) },

    "wood_fiber_perlin_enable": { type: "i", value: 1 },
    "wood_fiber_perlin_bands": { type: "i", value: 3 },
    "wood_fiber_perlin_weights": { type: "v4", value: new THREE.Vector4(3.0, 1.0, 0.2, 1) },
    "wood_fiber_perlin_frequencies": { type: "v4", value: new THREE.Vector4(40, 20, 3.5, 1) },
    "wood_fiber_perlin_scale_z": { type: "f", value: 0.3 },

    "wood_growth_perlin_enable": { type: "i", value: 1 },
    "wood_growth_perlin_bands": { type: "i", value: 3 },
    "wood_growth_perlin_weights": { type: "v4", value: new THREE.Vector4(1.0, 2, 1, 1) },
    "wood_growth_perlin_frequencies": { type: "v4", value: new THREE.Vector4(1, 5, 13, 1) },

    "wood_latewood_ratio": { type: "f", value: 0.238 },
    "wood_earlywood_sharpness": { type: "f", value: 0.395 },
    "wood_latewood_sharpness": { type: "f", value: 0.109 },
    "wood_ring_thickness": { type: "f", value: 0.75 },

    "wood_earlycolor_perlin_enable": { type: "i", value: 1 },
    "wood_earlycolor_perlin_bands": { type: "i", value: 2 },
    "wood_earlycolor_perlin_weights": { type: "v4", value: new THREE.Vector4(0.3, 0.5, 0.15, 1) },
    "wood_earlycolor_perlin_frequencies": { type: "v4", value: new THREE.Vector4(8, 3, 0.35, 1) },
    "wood_early_color": { type: "c", value: new THREE.Color(0.286, 0.157, 0.076) },

    "wood_use_manual_late_color": { type: "i", value: 0 },
    "wood_manual_late_color": { type: "c", value: new THREE.Color(0.62, 0.35, 0.127) },

    "wood_latecolor_perlin_enable": { type: "i", value: 1 },
    "wood_latecolor_perlin_bands": { type: "i", value: 1 },
    "wood_latecolor_perlin_weights": { type: "v4", value: new THREE.Vector4(0.75, 0.55, 1, 1) },
    "wood_latecolor_perlin_frequencies": { type: "v4", value: new THREE.Vector4(4.5, 0.05, 1, 1) },
    "wood_late_color_power": { type: "f", value: 1.25 },

    "wood_diffuse_perlin_enable": { type: "i", value: 1 },
    "wood_diffuse_perlin_bands": { type: "i", value: 3 },
    "wood_diffuse_perlin_weights": { type: "v4", value: new THREE.Vector4(0.15, 0.2, 0.05, 1) },
    "wood_diffuse_perlin_frequencies": { type: "v4", value: new THREE.Vector4(0.05, 0.1, 3, 1) },
    "wood_diffuse_perlin_scale_z": { type: "f", value: 0.2 },

    "wood_use_pores": { type: "i", value: 1 },
    "wood_pore_type": { type: "i", value: 0 },
    "wood_pore_radius": { type: "f", value: 0.04 },
    "wood_pore_cell_dim": { type: "f", value: 0.15 },
    "wood_pore_color_power": { type: "f", value: 1.45 },
    "wood_pore_depth": { type: "f", value: 0.02 },

    "wood_use_rays": { type: "i", value: 1 },
    "wood_ray_color_power": { type: "f", value: 1.1 },
    "wood_ray_seg_length_z": { type: "f", value: 5.0 },
    "wood_ray_num_slices": { type: "f", value: 160 },
    "wood_ray_ellipse_z2x": { type: "f", value: 10 },
    "wood_ray_ellipse_radius_x": { type: "f", value: 0.2 },

    "wood_use_latewood_bump": { type: "i", value: 1 },
    "wood_latewood_bump_depth": { type: "f", value: 0.01 },

    "wood_use_groove_roughness": { type: "i", value: 1 },
    "wood_groove_roughness": { type: "f", value: 0.85 },
    "wood_diffuse_lobe_weight": { type: "f", value: 0.9 },

    "wood_curly_distortion_enable": { type: "i", value: 0 },
    "wood_curly_distortion_scale": { type: "f", value: 0.25 },

    "wood_ring_fraction": { type: "v4", value: new THREE.Vector4(0.0, 0.0, 0.0, 0.0) },
    "wood_fall_rise": { type: "v2", value: new THREE.Vector2(0.0, 0.0) },

    "permutationMap": { type: "t", value: null },
    "gradientMap": { type: "t", value: null },
    "perm2DMap": { type: "t", value: null },
    "permGradMap": { type: "t", value: null },

    "importantSamplingRandomMap": { type: "t", value: null },
    "importantSamplingSolidAngleMap": { type: "t", value: null },

    "irradianceMap": { type: "t", value: null },
    "envMap": { type: "t", value: null },
    "exposureBias": { type: "f", value: 1.0 },
    "envMapExposure": { type: "f", value: 1.0 },
    "envRotationSin": { type: "f", value: 0.0 },
    "envRotationCos": { type: "f", value: 1.0 },

    "envExponentMin": { type: "f", value: 1.0 },
    "envExponentMax": { type: "f", value: 512.0 },
    "envExponentCount": { type: "f", value: 10.0 },

    // tiling
    "tilingOverallTransform": { type: "m4", value: new THREE.Matrix4() }, // TODO OGS has these as 4x4, could be 3x3
    // done above:
    //"TilingMap" : { type : "t", value: null },
    //"TilingMap_texMatrix" : { type: "m3", value: new THREE.Matrix3() },    // NOTE this is 3x3, OGS has it 4x4
    //"TilingNormalMap" : { type : "t", value: null },
    //"TilingNormalMap_texMatrix" : { type: "m3", value: new THREE.Matrix3() },    // NOTE this is 3x3, OGS has it 4x4
    //"TilingRandomMap" : { type : "t", value: null },
    //"TilingRandomMap_texMatrix" : { type: "m3", value: new THREE.Matrix3() },    // NOTE this is 3x3, OGS has it 4x4
    "uv2tile": { type: "v4", value: new THREE.Vector4(1.0, 0.0, 0.0, 1.0) },
    "tile2uv": { type: "v4", value: new THREE.Vector4(1.0, 0.0, 0.0, 1.0) },
    "tileAlignOffset": { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
    "tilingUVTransform": { type: "m4", value: new THREE.Matrix4() }, // TODO OGS has these as 4x4, could be 3x3
    "tilingRandomAxisS": { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
    "tilingRandomAxisT": { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
    "tilingRandomAlignmentOffset": { type: "v2", value: new THREE.Vector2(0.0, 0.0) } }]),





  vertexShader: (_shaders_prism_vert_glsl__WEBPACK_IMPORTED_MODULE_0___default()),
  fragmentShader: (_shaders_prism_frag_glsl__WEBPACK_IMPORTED_MODULE_1___default()) };



THREE.ShaderLib['prism'] = PrismShader;

var createPrismMaterial = function createPrismMaterial() {
  var prismMat = createShaderMaterial(PrismShader);
  prismMat.defaultAttributeValues['uvw'] = [0, 0, 0];
  prismMat.enable3DWoodBump = false;
  prismMat.enableImportantSampling = false;
  prismMat.mapList = {};
  prismMat.isPrismMaterial = true;

  return prismMat;
};

var clonePrismMaterial = function clonePrismMaterial(mat) {

  var prismMat = createPrismMaterial();

  // this is a dumb way to do what THREE.Material.prototype.clone.call( this, prismMat );
  // would do to create a clone and copy the basic properties. What's the non-stupid way?
  // And why does this material not have its own prototype.clone method?

  prismMat.name = mat.name;

  prismMat.side = mat.side;

  prismMat.opacity = mat.opacity;
  prismMat.transparent = mat.transparent;

  prismMat.blending = mat.blending;

  prismMat.blendSrc = mat.blendSrc;
  prismMat.blendDst = mat.blendDst;
  prismMat.blendEquation = mat.blendEquation;
  prismMat.blendSrcAlpha = mat.blendSrcAlpha;
  prismMat.blendDstAlpha = mat.blendDstAlpha;
  prismMat.blendEquationAlpha = mat.blendEquationAlpha;

  prismMat.depthTest = mat.depthTest;
  prismMat.depthWrite = mat.depthWrite;

  prismMat.polygonOffset = mat.polygonOffset;
  prismMat.polygonOffsetFactor = mat.polygonOffsetFactor;
  prismMat.polygonOffsetUnits = mat.polygonOffsetUnits;

  prismMat.alphaTest = mat.alphaTest;

  prismMat.overdraw = mat.overdraw;

  prismMat.visible = mat.visible;

  // end of the basics shared by all shaders


  prismMat.mapList = mat.mapList;

  prismMat.prismType = mat.prismType;

  //Prism common properties.
  prismMat.surface_albedo = mat.surface_albedo;
  if (mat.surface_albedo_map !== undefined)
  prismMat.surface_albedo_map = mat.surface_albedo_map;
  prismMat.surface_roughness = mat.surface_roughness;
  if (mat.surface_roughness_map !== undefined)
  prismMat.surface_roughness_map = mat.surface_roughness_map;
  prismMat.surface_anisotropy = mat.surface_anisotropy;
  if (mat.surface_anisotropy_map !== undefined)
  prismMat.surface_anisotropy_map = mat.surface_anisotropy_map;
  prismMat.surface_rotation = mat.surface_rotation;
  if (mat.surface_rotation_map !== undefined)
  prismMat.surface_rotation_map = mat.surface_rotation_map;
  if (mat.surface_cutout_map !== undefined)
  prismMat.surface_cutout_map = mat.surface_cutout_map;
  if (mat.surface_normal_map !== undefined)
  prismMat.surface_normal_map = mat.surface_normal_map;

  prismMat.uniforms.importantSamplingRandomMap.value = mat.uniforms.importantSamplingRandomMap.value;
  prismMat.uniforms.importantSamplingSolidAngleMap.value = mat.uniforms.importantSamplingSolidAngleMap.value;

  //Set Prism properties according to the material type.
  switch (prismMat.prismType) {
    case 'PrismOpaque':
      prismMat.opaque_albedo = new THREE.Color().copy(mat.opaque_albedo);
      prismMat.opaque_luminance_modifier = new THREE.Color().copy(mat.opaque_luminance_modifier);
      prismMat.opaque_f0 = mat.opaque_f0;
      prismMat.opaque_luminance = mat.opaque_luminance;

      if (mat.opaque_albedo_map !== undefined)
      prismMat.opaque_albedo_map = mat.opaque_albedo_map;
      if (mat.opaque_luminance_modifier_map !== undefined)
      prismMat.opaque_luminance_modifier_map = mat.opaque_luminance_modifier_map;
      if (mat.opaque_f0_map !== undefined)
      prismMat.opaque_f0_map = mat.opaque_f0_map;

      break;

    case 'PrismMetal':
      prismMat.metal_f0 = new THREE.Color().copy(mat.metal_f0);
      if (mat.metal_f0_map !== undefined)
      prismMat.metal_f0_map = mat.metal_f0_map;

      break;

    case 'PrismLayered':
      prismMat.layered_f0 = mat.layered_f0;
      prismMat.layered_diffuse = new THREE.Color().copy(mat.layered_diffuse);
      prismMat.layered_fraction = mat.layered_fraction;
      prismMat.layered_bottom_f0 = new THREE.Color().copy(mat.layered_bottom_f0);
      prismMat.layered_roughness = mat.layered_roughness;
      prismMat.layered_anisotropy = mat.layered_anisotropy;
      prismMat.layered_rotation = mat.layered_rotation;

      if (mat.layered_bottom_f0_map !== undefined)
      prismMat.layered_bottom_f0_map = mat.layered_bottom_f0_map;
      if (mat.layered_f0_map !== undefined)
      prismMat.layered_f0_map = mat.layered_f0_map;
      if (mat.layered_diffuse_map !== undefined)
      prismMat.layered_diffuse_map = mat.layered_diffuse_map;
      if (mat.layered_fraction_map !== undefined)
      prismMat.layered_fraction_map = mat.layered_fraction_map;
      if (mat.layered_rotationlayered_roughness_map !== undefined)
      prismMat.layered_rotationlayered_roughness_map = mat.layered_rotationlayered_roughness_map;
      if (mat.layered_anisotropy_map !== undefined)
      prismMat.layered_anisotropy_map = mat.layered_anisotropy_map;
      if (mat.layered_rotation_map !== undefined)
      prismMat.layered_rotation_map = mat.layered_rotation_map;
      if (mat.layered_normal_map !== undefined)
      prismMat.layered_normal_map = mat.layered_normal_map;

      break;

    case 'PrismTransparent':
      prismMat.transparent_color = new THREE.Color().copy(mat.transparent_color);
      prismMat.transparent_distance = mat.transparent_distance;
      prismMat.transparent_ior = mat.transparent_ior;

      prismMat.transparent = mat.transparent;
      prismMat.twoPassTransparency = mat.twoPassTransparency;
      break;

    case 'PrismGlazing':
      prismMat.glazing_f0 = new THREE.Color().copy(mat.glazing_f0);
      prismMat.glazing_transmission_color = new THREE.Color().copy(mat.glazing_transmission_color);
      prismMat.glazing_transmission_roughness = mat.glazing_transmission_roughness;

      if (mat.glazing_f0_map !== undefined)
      prismMat.glazing_f0_map = mat.glazing_f0_map;
      if (mat.glazing_transmission_color_map !== undefined)
      prismMat.glazing_transmission_color_map = mat.glazing_transmission_color_map;
      if (mat.glazing_transmission_roughness_map !== undefined)
      prismMat.glazing_transmission_roughness_map = mat.glazing_transmission_roughness_map;

      break;

    case 'PrismWood':
      prismMat.wood_fiber_cosine_enable = mat.wood_fiber_cosine_enable;
      prismMat.wood_fiber_cosine_bands = mat.wood_fiber_cosine_bands;
      prismMat.wood_fiber_cosine_weights = new THREE.Vector4().copy(mat.wood_fiber_cosine_weights);
      prismMat.wood_fiber_cosine_frequencies = new THREE.Vector4().copy(mat.wood_fiber_cosine_frequencies);

      prismMat.wood_fiber_perlin_enable = mat.wood_fiber_perlin_enable;
      prismMat.wood_fiber_perlin_bands = mat.wood_fiber_perlin_bands;
      prismMat.wood_fiber_perlin_weights = new THREE.Vector4().copy(mat.wood_fiber_perlin_weights);
      prismMat.wood_fiber_perlin_frequencies = new THREE.Vector4().copy(mat.wood_fiber_perlin_frequencies);
      prismMat.wood_fiber_perlin_scale_z = mat.wood_fiber_perlin_scale_z;

      prismMat.wood_growth_perlin_enable = mat.wood_growth_perlin_enable;
      prismMat.wood_growth_perlin_bands = mat.wood_growth_perlin_bands;
      prismMat.wood_growth_perlin_weights = new THREE.Vector4().copy(mat.wood_growth_perlin_weights);
      prismMat.wood_growth_perlin_frequencies = new THREE.Vector4().copy(mat.wood_growth_perlin_frequencies);

      prismMat.wood_latewood_ratio = mat.wood_latewood_ratio;
      prismMat.wood_earlywood_sharpness = mat.wood_earlywood_sharpness;
      prismMat.wood_latewood_sharpness = mat.wood_latewood_sharpness;
      prismMat.wood_ring_thickness = mat.wood_ring_thickness;

      prismMat.wood_earlycolor_perlin_enable = mat.wood_earlycolor_perlin_enable;
      prismMat.wood_earlycolor_perlin_bands = mat.wood_earlycolor_perlin_bands;
      prismMat.wood_earlycolor_perlin_weights = new THREE.Vector4().copy(mat.wood_earlycolor_perlin_weights);
      prismMat.wood_earlycolor_perlin_frequencies = new THREE.Vector4().copy(mat.wood_earlycolor_perlin_frequencies);
      prismMat.wood_early_color = new THREE.Color().copy(mat.wood_early_color);

      prismMat.wood_use_manual_late_color = mat.wood_use_manual_late_color;
      prismMat.wood_manual_late_color = new THREE.Color().copy(mat.wood_manual_late_color);

      prismMat.wood_latecolor_perlin_enable = mat.wood_latecolor_perlin_enable;
      prismMat.wood_latecolor_perlin_bands = mat.wood_latecolor_perlin_bands;
      prismMat.wood_latecolor_perlin_weights = new THREE.Vector4().copy(mat.wood_latecolor_perlin_weights);
      prismMat.wood_latecolor_perlin_frequencies = new THREE.Vector4().copy(mat.wood_latecolor_perlin_frequencies);
      prismMat.wood_late_color_power = mat.wood_late_color_power;

      prismMat.wood_diffuse_perlin_enable = mat.wood_diffuse_perlin_enable;
      prismMat.wood_diffuse_perlin_bands = mat.wood_diffuse_perlin_bands;
      prismMat.wood_diffuse_perlin_weights = new THREE.Vector4().copy(mat.wood_diffuse_perlin_weights);
      prismMat.wood_diffuse_perlin_frequencies = new THREE.Vector4().copy(mat.wood_diffuse_perlin_frequencies);
      prismMat.wood_diffuse_perlin_scale_z = mat.wood_diffuse_perlin_scale_z;

      prismMat.wood_use_pores = mat.wood_use_pores;
      prismMat.wood_pore_type = mat.wood_pore_type;
      prismMat.wood_pore_radius = mat.wood_pore_radius;
      prismMat.wood_pore_cell_dim = mat.wood_pore_cell_dim;
      prismMat.wood_pore_color_power = mat.wood_pore_color_power;
      prismMat.wood_pore_depth = mat.wood_pore_depth;

      prismMat.wood_use_rays = mat.wood_use_rays;
      prismMat.wood_ray_color_power = mat.wood_ray_color_power;
      prismMat.wood_ray_seg_length_z = mat.wood_ray_seg_length_z;
      prismMat.wood_ray_num_slices = mat.wood_ray_num_slices;
      prismMat.wood_ray_ellipse_z2x = mat.wood_ray_ellipse_z2x;
      prismMat.wood_ray_ellipse_radius_x = mat.wood_ray_ellipse_radius_x;

      prismMat.wood_use_latewood_bump = mat.wood_use_latewood_bump;
      prismMat.wood_latewood_bump_depth = mat.wood_latewood_bump_depth;

      prismMat.wood_use_groove_roughness = mat.wood_use_groove_roughness;
      prismMat.wood_groove_roughness = mat.wood_groove_roughness;
      prismMat.wood_diffuse_lobe_weight = mat.wood_diffuse_lobe_weight;

      // share common prism DataTextures
      // Note that these are directly stored in the uniforms (see MaterialConverter.convertMaterial)
      prismMat.uniforms.permutationMap.value = mat.uniforms.permutationMap.value;
      prismMat.uniforms.gradientMap.value = mat.uniforms.gradientMap.value;
      prismMat.uniforms.perm2DMap.value = mat.uniforms.perm2DMap.value;
      prismMat.uniforms.permGradMap.value = mat.uniforms.permGradMap.value;

      if (mat.wood_curly_distortion_map !== undefined)
      {
        prismMat.wood_curly_distortion_map = mat.wood_curly_distortion_map;
        prismMat.wood_curly_distortion_enable = mat.wood_curly_distortion_enable;
        prismMat.wood_curly_distortion_scale = mat.wood_curly_distortion_scale;
      }

      prismMat.wood_ring_fraction = mat.wood_ring_fraction;
      prismMat.wood_fall_rise = mat.wood_fall_rise;

      break;

    default:
      console.warn('Unknown prism type: ' + mat.prismType);}


  prismMat.envExponentMin = mat.envExponentMin;
  prismMat.envExponentMax = mat.envExponentMax;
  prismMat.envExponentCount = mat.envExponentCount;
  prismMat.envMap = mat.envMap;

  if (mat.useTiling) {
    prismMat.useTiling = mat.useTiling;
    prismMat.tilingOverallTransform = new THREE.Matrix4().copy(mat.tilingOverallTransform);
    prismMat.TilingMap = mat.TilingMap;
    prismMat.TilingMap_texMatrix = new THREE.Matrix3().copy(mat.TilingMap_texMatrix);
    prismMat.hasRoundCorner = mat.hasRoundCorner;
    if (prismMat.hasRoundCorner) {
      prismMat.TilingNormalMap = mat.TilingNormalMap;
      prismMat.TilingNormalMap_texMatrix = new THREE.Matrix3().copy(mat.TilingNormalMap_texMatrix);
    }
    prismMat.useRandomOffset = mat.useRandomOffset;
    if (prismMat.useRandomOffset) {
      prismMat.TilingRandomMap = mat.TilingRandomMap;
      prismMat.TilingRandomMap_texMatrix = new THREE.Matrix3().copy(mat.TilingRandomMap_texMatrix);
      prismMat.tilingRandomAxisS = new THREE.Vector2().copy(mat.tilingRandomAxisS);
      prismMat.tilingRandomAxisT = new THREE.Vector2().copy(mat.tilingRandomAxisT);
      prismMat.tilingRandomAlignmentOffset = new THREE.Vector2().copy(mat.tilingRandomAlignmentOffset);
    }
    prismMat.uv2tile = mat.uv2tile;
    prismMat.tile2uv = mat.tile2uv;
    prismMat.tilingRepeatRange = [
    mat.tilingRepeatRange[0],
    mat.tilingRepeatRange[1],
    mat.tilingRepeatRange[2],
    mat.tilingRepeatRange[3]];

    prismMat.tileAlignOffset = new THREE.Vector2().copy(mat.tileAlignOffset);
    prismMat.tilingUVTransform = new THREE.Matrix4().copy(mat.tilingUVTransform);
  }

  prismMat.defines = mat.defines;
  return prismMat;
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************************!*\
  !*** ./extensions/MaterialConverterPrism/index.js ***!
  \****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MaterialConverterPrism__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MaterialConverterPrism */ "./extensions/MaterialConverterPrism/MaterialConverterPrism.js");
/* harmony import */ var _PrismShader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PrismShader */ "./extensions/MaterialConverterPrism/PrismShader.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}


function _export(lib, ns) {
  for (var e in lib) {
    ns[e] = lib[e];
  }
}

var av = Autodesk.Viewing;
_export(_MaterialConverterPrism__WEBPACK_IMPORTED_MODULE_0__, AutodeskNamespace('Autodesk.Viewing.MaterialConverterPrism'));
_export(_PrismShader__WEBPACK_IMPORTED_MODULE_1__, av.Private);

/**
                                   * Extension with Prism material conversion functions
                                   */var
MaterialConverterPrismExtension = /*#__PURE__*/function (_av$Extension) {_inherits(MaterialConverterPrismExtension, _av$Extension);var _super = _createSuper(MaterialConverterPrismExtension);
  function MaterialConverterPrismExtension(viewer, options) {_classCallCheck(this, MaterialConverterPrismExtension);return _super.call(this,
    viewer, options);
  }_createClass(MaterialConverterPrismExtension, [{ key: "load", value: function load()

    {return true;} }, { key: "unload", value: function unload()
    {return true;} }, { key: "activate", value: function activate()
    {return true;} }, { key: "deactivate", value: function deactivate()
    {return false;} }]);return MaterialConverterPrismExtension;}(av.Extension);


av.theExtensionManager.registerExtension('Autodesk.Viewing.MaterialConverterPrism', MaterialConverterPrismExtension);
})();

Autodesk.Extensions.MaterialConverterPrism = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=MaterialConverterPrism.js.map